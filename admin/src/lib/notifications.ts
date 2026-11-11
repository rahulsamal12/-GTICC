import crypto from 'crypto';
import { query, queryOne, execute, logAuditEvent } from '@/lib/db';
import {
  ApplicationEmailContext,
  buildAcceptanceEmail,
  buildRejectionEmail,
  sendBrevoEmail,
  getBrevoConfig,
} from '@/lib/brevo';

export interface NotificationDispatchResult {
  sent: boolean;
  skipped?: boolean;
  status: 'SENT' | 'FAILED' | 'SKIPPED';
  messageId?: string;
  error?: string;
  reason?: string;
}

/**
 * Dispatches an acceptance or rejection email for an application.
 * - Idempotent: Skips if an email for this (applicationId, decision) was already successfully sent.
 * - Non-blocking to caller's DB commit: Designed to run AFTER decision is saved in DB.
 * - Records outcome in application_notifications table.
 */
export async function dispatchApplicationNotification(
  ctx: ApplicationEmailContext,
  adminEmail: string = 'system',
  options: { forceRetry?: boolean } = {}
): Promise<NotificationDispatchResult> {
  const { applicationId, applicationType, decision, recipientEmail, recipientName } = ctx;

  // 1. Only process ACCEPTED or REJECTED
  if (decision !== 'ACCEPTED' && decision !== 'REJECTED') {
    return {
      sent: false,
      skipped: true,
      status: 'SKIPPED',
      reason: `No email configured for status: ${decision}`,
    };
  }

  // 2. Validate recipient email format
  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
    const errorMsg = `Invalid or missing recipient email: ${recipientEmail}`;
    console.error(`[Notification Error] ${errorMsg}`);
    await recordNotification({
      id: crypto.randomUUID(),
      applicationType,
      applicationId,
      recipientEmail: recipientEmail || 'unknown',
      recipientName: recipientName || 'Applicant',
      decision,
      status: 'FAILED',
      errorMessage: errorMsg,
    });
    return { sent: false, status: 'FAILED', error: errorMsg };
  }

  // 3. Idempotency Check: Did we already send this exact decision email successfully?
  // (Unless explicit retry requested)
  if (!options.forceRetry) {
    try {
      const existingSent = await queryOne<{ id: string; message_id: string }>(
        `SELECT id, message_id FROM application_notifications
         WHERE application_id = ? AND decision = ? AND status = 'SENT'
         LIMIT 1`,
        [applicationId, decision]
      );

      if (existingSent) {
        console.info(`[Notification Skipped] Email for ${applicationId} (${decision}) was already sent (MessageId: ${existingSent.message_id}).`);
        return {
          sent: false,
          skipped: true,
          status: 'SKIPPED',
          messageId: existingSent.message_id,
          reason: 'Duplicate notification prevented — decision email was already sent.',
        };
      }
    } catch (err: any) {
      console.warn('[Notification Warning] Could not check idempotency in application_notifications:', err.message);
    }
  }

  // 4. Check Brevo configuration
  const brevoConfig = getBrevoConfig();
  if (!brevoConfig.isConfigured) {
    const errorMsg = brevoConfig.error || 'Brevo email service not configured.';
    console.warn(`[Notification Warning] ${errorMsg}`);
    await recordNotification({
      id: crypto.randomUUID(),
      applicationType,
      applicationId,
      recipientEmail: recipientEmail.trim(),
      recipientName: recipientName.trim(),
      decision,
      status: 'FAILED',
      errorMessage: errorMsg,
    });
    return { sent: false, status: 'FAILED', error: errorMsg };
  }

  // 5. Build branded email template
  const emailContent = decision === 'ACCEPTED'
    ? buildAcceptanceEmail(ctx)
    : buildRejectionEmail(ctx);

  const notifId = crypto.randomUUID();

  // 6. Trigger Brevo transactional send
  const sendResult = await sendBrevoEmail({
    to: [{ email: recipientEmail.trim(), name: recipientName.trim() }],
    subject: emailContent.subject,
    htmlContent: emailContent.html,
    textContent: emailContent.text,
  });

  // 7. Record notification outcome in MySQL
  if (sendResult.success) {
    await recordNotification({
      id: notifId,
      applicationType,
      applicationId,
      recipientEmail: recipientEmail.trim(),
      recipientName: recipientName.trim(),
      decision,
      status: 'SENT',
      messageId: sendResult.messageId,
      sentAt: new Date(),
    });

    await logAuditEvent({
      adminEmail,
      action: 'SEND_DECISION_EMAIL',
      entityType: `${applicationType.toLowerCase()}_application`,
      entityId: applicationId,
      details: `Brevo decision email (${decision}) delivered to ${recipientEmail.trim()} (MsgId: ${sendResult.messageId})`,
    });

    return {
      sent: true,
      status: 'SENT',
      messageId: sendResult.messageId,
    };
  } else {
    const errorMsg = sendResult.error || 'Brevo API rejected email dispatch.';
    await recordNotification({
      id: notifId,
      applicationType,
      applicationId,
      recipientEmail: recipientEmail.trim(),
      recipientName: recipientName.trim(),
      decision,
      status: 'FAILED',
      errorMessage: errorMsg,
    });

    await logAuditEvent({
      adminEmail,
      action: 'EMAIL_DISPATCH_FAILED',
      entityType: `${applicationType.toLowerCase()}_application`,
      entityId: applicationId,
      details: `Brevo email (${decision}) to ${recipientEmail.trim()} failed: ${errorMsg}`,
    });

    return {
      sent: false,
      status: 'FAILED',
      error: errorMsg,
    };
  }
}

async function recordNotification(params: {
  id: string;
  applicationType: string;
  applicationId: string;
  recipientEmail: string;
  recipientName: string;
  senderEmail?: string;
  decision: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  messageId?: string;
  errorMessage?: string;
  sentAt?: Date;
}) {
  try {
    const config = getBrevoConfig();
    const sender = params.senderEmail || config.senderEmail || 'gticcofficial@gmail.com';
    await execute(
      `INSERT INTO application_notifications
        (id, application_type, application_id, recipient_email, recipient_name, sender_email,
         decision, status, message_id, error_message, sent_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      [
        params.id,
        params.applicationType,
        params.applicationId,
        params.recipientEmail,
        params.recipientName,
        sender,
        params.decision,
        params.status,
        params.messageId || null,
        params.errorMessage || null,
        params.sentAt ? params.sentAt.toISOString().slice(0, 19).replace('T', ' ') : null,
      ]
    );
  } catch (err: any) {
    console.error('[Notification Record Error] Failed to persist notification record:', err.message);
  }
}

/**
 * Retrieve the latest notification history for an application
 */
export async function getApplicationNotifications(applicationId: string) {
  try {
    return await query(
      `SELECT
        id,
        application_type AS applicationType,
        application_id   AS applicationId,
        recipient_email  AS recipientEmail,
        recipient_name   AS recipientName,
        COALESCE(sender_email, 'gticcofficial@gmail.com') AS senderEmail,
        decision,
        status,
        message_id       AS messageId,
        error_message    AS errorMessage,
        sent_at          AS sentAt,
        created_at       AS createdAt
      FROM application_notifications
      WHERE application_id = ?
      ORDER BY created_at DESC`,
      [applicationId]
    );
  } catch (err) {
    console.error('[Notification Query Error] Failed to fetch notifications:', err);
    return [];
  }
}

