import https from 'https';

export interface BrevoEmailPayload {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  sender?: { name: string; email: string };
}

export interface BrevoSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ApplicationEmailContext {
  applicationId: string;
  applicationType: 'BUSINESS' | 'LEADERSHIP' | 'GENERAL';
  decision: 'ACCEPTED' | 'REJECTED';
  recipientName: string;
  recipientEmail: string;
  organizationName?: string;
  feedbackOrNote?: string | null;
}

/**
 * Validates Brevo environment configuration
 */
export function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'GTICC';

  if (!apiKey) {
    return { isConfigured: false, error: 'BREVO_API_KEY environment variable is missing.' };
  }
  if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
    return { isConfigured: false, error: 'BREVO_SENDER_EMAIL is missing or not a valid email address.' };
  }

  return {
    isConfigured: true,
    apiKey,
    senderEmail,
    senderName,
  };
}

/**
 * Sends a transactional email using Brevo's v3 REST API via native Node https
 */
export async function sendBrevoEmail(payload: BrevoEmailPayload): Promise<BrevoSendResult> {
  const config = getBrevoConfig();
  if (!config.isConfigured) {
    console.warn(`[Brevo Email Warning] Cannot send email: ${config.error}`);
    return { success: false, error: config.error };
  }

  const postData = JSON.stringify({
    sender: payload.sender || {
      name: config.senderName,
      email: config.senderEmail,
    },
    to: payload.to,
    subject: payload.subject,
    htmlContent: payload.htmlContent,
    textContent: payload.textContent,
  });

  return new Promise<BrevoSendResult>((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'GTICC-Admin/1.0',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000, // 10-second timeout
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const statusCode = res.statusCode || 500;
        let responseJson: any = null;
        try {
          responseJson = JSON.parse(body);
        } catch {
          responseJson = { raw: body };
        }

        if (statusCode >= 200 && statusCode < 300) {
          const messageId = responseJson.messageId || 'DELIVERED';
          console.info(`[Brevo Email Sent] Recipient: ${payload.to[0]?.email}, messageId: ${messageId}`);
          resolve({ success: true, messageId });
        } else {
          const errDetail = responseJson.message || responseJson.code || `HTTP ${statusCode}`;
          console.error(`[Brevo Email Error] HTTP ${statusCode}: ${errDetail}`);
          resolve({ success: false, error: errDetail });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('[Brevo Email Error] Request timed out after 10000ms');
      resolve({ success: false, error: 'Brevo API request timed out.' });
    });

    req.on('error', (err) => {
      console.error(`[Brevo Email Network Error]: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Builds responsive, professional GTICC acceptance email
 */
export function buildAcceptanceEmail(ctx: ApplicationEmailContext): { subject: string; html: string; text: string } {
  const typeLabels: Record<string, string> = {
    BUSINESS: 'Business & Corporate Membership Onboarding',
    LEADERSHIP: 'Leadership & Position Screening Questionnaire',
    GENERAL: 'Executive Membership Application',
  };
  const typeLabel = typeLabels[ctx.applicationType] || 'Membership Application';

  const subject = `Welcome to GTICC — Your ${typeLabel} Has Been Accepted (${ctx.applicationId})`;

  const text = `
Dear ${ctx.recipientName},

We are pleased to inform you that your application for ${typeLabel} (Reference ID: ${ctx.applicationId}) has been officially ACCEPTED by the Global Trade & Investment Chamber of Commerce (GTICC) Executive Review Committee.

Organization: ${ctx.organizationName || 'N/A'}
Application Track: ${typeLabel}
Status: Confirmed & Approved

Next Steps:
1. Executive Onboarding Verification: Our Secretariat is preparing your formal credential file and bilateral network profile.
2. Council & Corridor Alignment: A GTICC Trade Director or Regional Envoy will reach out directly to coordinate strategic engagement, corridor access, and commercial matchmaking objectives.

If you have any questions or require immediate assistance, please reply directly to this notification quoting your Reference ID (${ctx.applicationId}).

Sincerely,

Executive Review Committee
Global Trade & Investment Chamber of Commerce (GTICC)
https://gticc.org
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Application Accepted | GTICC</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #040c18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 30px auto; background-color: #081629; border: 1px solid rgba(212, 179, 92, 0.45); border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .header { background: linear-gradient(135deg, #07101e 0%, #0c2040 100%); padding: 36px 24px; text-align: center; border-bottom: 2px solid #C8A24A; }
    .logo-badge { display: inline-block; padding: 6px 16px; background-color: rgba(200, 162, 74, 0.15); border: 1px solid #C8A24A; border-radius: 6px; color: #f3ce72; font-size: 12.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; }
    .title { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.2px; }
    .subtitle { color: #cbd5e1; font-size: 13.5px; margin-top: 8px; font-weight: 500; }
    .body-content { padding: 32px 30px; line-height: 1.7; font-size: 15px; color: #f1f5f9; background-color: #081629; }
    .body-content p { color: #f1f5f9; margin: 0 0 18px 0; }
    .status-card { background-color: #062b20; border: 1px solid #10b981; border-radius: 8px; padding: 20px 22px; margin: 24px 0; }
    .status-title { color: #4ade80; font-size: 16px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: 0.2px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 14px; }
    .meta-table td { padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); vertical-align: top; }
    .meta-table tr:last-child td { border-bottom: none; }
    .meta-table td.label { width: 150px; color: #cbd5e1; font-weight: 600; }
    .meta-table td.value { color: #ffffff; font-weight: 600; }
    .highlight-gold { color: #f6d27a; font-weight: 700; }
    .next-steps { background-color: #0c1c33; border: 1px solid rgba(200, 162, 74, 0.3); border-radius: 8px; padding: 20px 22px; margin: 24px 0; }
    .next-steps h4 { margin: 0 0 12px 0; color: #f6d27a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; }
    .next-steps ol { margin: 0; padding-left: 20px; color: #f1f5f9; font-size: 14px; line-height: 1.65; }
    .next-steps li { margin-bottom: 10px; color: #f1f5f9; }
    .next-steps li strong { color: #ffffff; }
    .footer { background-color: #040d1a; padding: 26px 24px; text-align: center; border-top: 1px solid rgba(212, 179, 92, 0.2); font-size: 12.5px; color: #94a3b8; line-height: 1.6; }
    .footer a { color: #f6d27a; text-decoration: underline; font-weight: 600; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #040c18;">
  <div class="container" style="max-width: 600px; margin: 30px auto; background-color: #081629; border: 1px solid rgba(212, 179, 92, 0.45); border-radius: 12px;">
    <div class="header" style="background-color: #0c2040; padding: 36px 24px; text-align: center; border-bottom: 2px solid #C8A24A;">
      <div class="logo-badge" style="display: inline-block; padding: 6px 16px; background-color: #17263c; border: 1px solid #C8A24A; border-radius: 6px; color: #f3ce72; font-size: 12.5px; font-weight: 700; text-transform: uppercase;">GTICC Official Correspondence</div>
      <h1 class="title" style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 12px 0 0 0;">Application Accepted</h1>
      <div class="subtitle" style="color: #cbd5e1; font-size: 13.5px; margin-top: 8px;">Global Trade &amp; Investment Chamber of Commerce</div>
    </div>
    <div class="body-content" style="padding: 32px 30px; font-size: 15px; color: #f1f5f9; background-color: #081629;">
      <p style="font-size: 16px; color: #ffffff; margin-bottom: 16px;">Dear <strong style="color: #ffffff;">${escapeHtml(ctx.recipientName)}</strong>,</p>
      <p style="color: #f1f5f9; line-height: 1.7;">We are pleased to inform you that your application for <strong style="color: #ffffff;">${escapeHtml(typeLabel)}</strong> has been formally reviewed and <strong style="color: #4ade80;">ACCEPTED</strong> by the GTICC Executive Review Committee.</p>

      <div class="status-card" style="background-color: #062b20; border: 1px solid #10b981; border-radius: 8px; padding: 20px 22px; margin: 24px 0;">
        <div class="status-title" style="color: #4ade80; font-size: 16px; font-weight: 700; margin-bottom: 10px;">✓ Decision Confirmed: Accepted</div>
        <table class="meta-table" style="width: 100%; font-size: 14px;">
          <tr>
            <td class="label" style="width: 150px; color: #cbd5e1; font-weight: 600; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Reference ID:</td>
            <td class="value" style="color: #ffffff; font-weight: 600; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);"><span class="highlight-gold" style="color: #f6d27a; font-weight: 700;">#${escapeHtml(ctx.applicationId)}</span></td>
          </tr>
          ${ctx.organizationName ? `
          <tr>
            <td class="label" style="width: 150px; color: #cbd5e1; font-weight: 600; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Organization:</td>
            <td class="value" style="color: #ffffff; font-weight: 600; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${escapeHtml(ctx.organizationName)}</td>
          </tr>` : ''}
          <tr>
            <td class="label" style="width: 150px; color: #cbd5e1; font-weight: 600; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Application Track:</td>
            <td class="value" style="color: #ffffff; font-weight: 600; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${escapeHtml(typeLabel)}</td>
          </tr>
          <tr>
            <td class="label" style="width: 150px; color: #cbd5e1; font-weight: 600; padding: 8px 0;">Official Contact:</td>
            <td class="value" style="color: #ffffff; font-weight: 600; padding: 8px 0;">${escapeHtml(ctx.recipientEmail)}</td>
          </tr>
        </table>
      </div>

      <div class="next-steps" style="background-color: #0c1c33; border: 1px solid rgba(200, 162, 74, 0.35); border-radius: 8px; padding: 20px 22px; margin: 24px 0;">
        <h4 style="margin: 0 0 12px 0; color: #f6d27a; font-size: 14px; text-transform: uppercase; font-weight: 700;">Confirmed Next Steps</h4>
        <ol style="margin: 0; padding-left: 20px; color: #f1f5f9; font-size: 14px; line-height: 1.65;">
          <li style="margin-bottom: 10px;"><strong style="color: #ffffff;">Executive File Registration:</strong> The Secretariat is completing your institutional affiliation and credential entry within the global trade registry.</li>
          <li style="margin-bottom: 4px;"><strong style="color: #ffffff;">Strategic Corridor Briefing:</strong> A GTICC Trade Director or Regional Envoy will reach out directly to coordinate bilateral engagements and commercial matchmaking milestones.</li>
        </ol>
      </div>

      <p style="font-size: 14px; color: #cbd5e1; margin-top: 24px; line-height: 1.6;">For inquiries regarding your onboarding agenda, please contact the Secretariat at <a href="mailto:info@gticc.org" style="color: #f6d27a; font-weight: 600; text-decoration: underline;">info@gticc.org</a> quoting your Reference ID (<strong style="color: #ffffff;">#${escapeHtml(ctx.applicationId)}</strong>).</p>

      <p style="font-size: 14px; color: #cbd5e1; margin-top: 24px; line-height: 1.6;">
        Sincerely,<br>
        <strong style="color: #ffffff; font-size: 15px;">Executive Review Committee</strong><br>
        <span style="color: #94a3b8;">Global Trade &amp; Investment Chamber of Commerce (GTICC)</span>
      </p>
    </div>
    <div class="footer" style="background-color: #040d1a; padding: 24px; text-align: center; border-top: 1px solid rgba(212, 179, 92, 0.2); font-size: 12.5px; color: #94a3b8; line-height: 1.6;">
      &copy; ${new Date().getFullYear()} Global Trade &amp; Investment Chamber of Commerce (GTICC). All rights reserved.<br>
      This is a confidential official communication sent in reference to submission #${escapeHtml(ctx.applicationId)}.
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, html, text };
}

/**
 * Builds responsive, respectful GTICC rejection email
 */
export function buildRejectionEmail(ctx: ApplicationEmailContext): { subject: string; html: string; text: string } {
  const typeLabels: Record<string, string> = {
    BUSINESS: 'Business & Corporate Membership Onboarding',
    LEADERSHIP: 'Leadership & Position Screening Questionnaire',
    GENERAL: 'Executive Membership Application',
  };
  const typeLabel = typeLabels[ctx.applicationType] || 'Membership Application';

  const subject = `Update Regarding Your GTICC ${typeLabel} (${ctx.applicationId})`;

  const remarksBlockText = ctx.feedbackOrNote?.trim()
    ? `\nCommittee Remarks:\n${ctx.feedbackOrNote.trim()}\n`
    : '';

  const text = `
Dear ${ctx.recipientName},

Thank you for your interest in the Global Trade & Investment Chamber of Commerce (GTICC) and for submitting your ${typeLabel} (Reference ID: ${ctx.applicationId}).

After a comprehensive review by the Executive Review Committee, we regret to inform you that we are unable to accept your application at this time.${remarksBlockText}
Due to the curated nature of our bilateral trade delegations and specific regional alignment criteria, we must make highly selective determinations based on currently active commercial mandates.

We sincerely appreciate the time and effort you dedicated to your submission. We encourage you to follow GTICC public trade initiatives and consider reapplying in a future intake cycle as commercial agendas evolve.

Sincerely,

Executive Review Committee
Global Trade & Investment Chamber of Commerce (GTICC)
https://gticc.org
`.trim();

  const remarksBlockHtml = ctx.feedbackOrNote?.trim()
    ? `
      <div class="remarks-box" style="background-color: #112038; border-left: 4px solid #C8A24A; border-radius: 6px; padding: 16px 20px; margin: 24px 0;">
        <span style="display: block; font-size: 12px; font-weight: 700; color: #f6d27a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">Committee Review Remarks</span>
        <p style="margin: 0; font-size: 14px; color: #ffffff; line-height: 1.65; font-weight: 500;">${escapeHtml(ctx.feedbackOrNote.trim())}</p>
      </div>`
    : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Application Status | GTICC</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #040c18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 30px auto; background-color: #081629; border: 1px solid rgba(212, 179, 92, 0.45); border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .header { background: linear-gradient(135deg, #07101e 0%, #0c2040 100%); padding: 36px 24px; text-align: center; border-bottom: 2px solid rgba(212, 179, 92, 0.5); }
    .logo-badge { display: inline-block; padding: 6px 16px; background-color: rgba(200, 162, 74, 0.15); border: 1px solid #C8A24A; border-radius: 6px; color: #f3ce72; font-size: 12.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; }
    .title { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.2px; }
    .subtitle { color: #cbd5e1; font-size: 13.5px; margin-top: 8px; font-weight: 500; }
    .body-content { padding: 32px 30px; line-height: 1.7; font-size: 15px; color: #f1f5f9; background-color: #081629; }
    .body-content p { color: #f1f5f9; margin: 0 0 18px 0; }
    .meta-box { background-color: #0c1c33; border: 1px solid rgba(200, 162, 74, 0.35); border-radius: 8px; padding: 18px 22px; margin: 24px 0; font-size: 14px; }
    .footer { background-color: #040d1a; padding: 26px 24px; text-align: center; border-top: 1px solid rgba(212, 179, 92, 0.2); font-size: 12.5px; color: #94a3b8; line-height: 1.6; }
    .footer a { color: #f6d27a; text-decoration: underline; font-weight: 600; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #040c18;">
  <div class="container" style="max-width: 600px; margin: 30px auto; background-color: #081629; border: 1px solid rgba(212, 179, 92, 0.45); border-radius: 12px;">
    <div class="header" style="background-color: #0c2040; padding: 36px 24px; text-align: center; border-bottom: 2px solid rgba(212, 179, 92, 0.5);">
      <div class="logo-badge" style="display: inline-block; padding: 6px 16px; background-color: #17263c; border: 1px solid #C8A24A; border-radius: 6px; color: #f3ce72; font-size: 12.5px; font-weight: 700; text-transform: uppercase;">GTICC Official Correspondence</div>
      <h1 class="title" style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 12px 0 0 0;">Application Status Update</h1>
      <div class="subtitle" style="color: #cbd5e1; font-size: 13.5px; margin-top: 8px;">Global Trade &amp; Investment Chamber of Commerce</div>
    </div>
    <div class="body-content" style="padding: 32px 30px; font-size: 15px; color: #f1f5f9; background-color: #081629;">
      <p style="font-size: 16px; color: #ffffff; margin-bottom: 16px;">Dear <strong style="color: #ffffff;">${escapeHtml(ctx.recipientName)}</strong>,</p>
      <p style="color: #f1f5f9; line-height: 1.7;">Thank you for your interest in the Global Trade &amp; Investment Chamber of Commerce (GTICC) and for submitting your application for <strong style="color: #ffffff;">${escapeHtml(typeLabel)}</strong>.</p>

      <div class="meta-box" style="background-color: #0c1c33; border: 1px solid rgba(200, 162, 74, 0.35); border-radius: 8px; padding: 18px 22px; margin: 24px 0; font-size: 14px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #cbd5e1; font-weight: 600; padding: 4px 0; width: 150px;">Reference ID:</td>
            <td style="padding: 4px 0;"><strong style="color: #f6d27a;">#${escapeHtml(ctx.applicationId)}</strong></td>
          </tr>
          ${ctx.organizationName ? `
          <tr>
            <td style="color: #cbd5e1; font-weight: 600; padding: 4px 0;">Organization:</td>
            <td style="padding: 4px 0;"><strong style="color: #ffffff;">${escapeHtml(ctx.organizationName)}</strong></td>
          </tr>` : ''}
          <tr>
            <td style="color: #cbd5e1; font-weight: 600; padding: 4px 0;">Application Track:</td>
            <td style="padding: 4px 0;"><strong style="color: #ffffff;">${escapeHtml(typeLabel)}</strong></td>
          </tr>
          <tr>
            <td style="color: #cbd5e1; font-weight: 600; padding: 4px 0;">Official Contact:</td>
            <td style="padding: 4px 0;"><strong style="color: #ffffff;">${escapeHtml(ctx.recipientEmail)}</strong></td>
          </tr>
        </table>
      </div>

      <p style="color: #f1f5f9; line-height: 1.7;">Following comprehensive evaluation by the Executive Review Committee, we regret to inform you that we are unable to accept your application for this cycle.</p>

      ${remarksBlockHtml}

      <p style="color: #f1f5f9; line-height: 1.7;">Given the specific sector mandates and bilateral corridor criteria governing our ongoing delegations, selections are carefully tailored to current commercial agendas.</p>
      <p style="color: #f1f5f9; line-height: 1.7;">We sincerely appreciate the time and insight shared in your submission. You are welcome to participate in GTICC open trade dialogues and consider submitting a new application during future intake cycles as bilateral priorities develop.</p>

      <p style="font-size: 14px; color: #cbd5e1; margin-top: 26px; line-height: 1.6;">
        Sincerely,<br>
        <strong style="color: #ffffff; font-size: 15px;">Executive Review Committee</strong><br>
        <span style="color: #94a3b8;">Global Trade &amp; Investment Chamber of Commerce (GTICC)</span>
      </p>
    </div>
    <div class="footer" style="background-color: #040d1a; padding: 24px; text-align: center; border-top: 1px solid rgba(212, 179, 92, 0.2); font-size: 12.5px; color: #94a3b8; line-height: 1.6;">
      &copy; ${new Date().getFullYear()} Global Trade &amp; Investment Chamber of Commerce (GTICC). All rights reserved.<br>
      This message is sent in reference to submission #${escapeHtml(ctx.applicationId)}.
    </div>
  </div>
</body>
</html>
`.trim();

  return { subject, html, text };
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

