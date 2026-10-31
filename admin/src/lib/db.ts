import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is missing.');
    }

    if (!databaseUrl.startsWith('mysql://')) {
      throw new Error('Invalid DATABASE_URL. Must be a verified mysql:// connection string. Silent SQLite fallback is strictly prohibited.');
    }

    pool = mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getPool();
  const [rows] = await p.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  const p = getPool();
  const [result] = await p.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

export async function withTransaction<T>(
  callback: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const p = getPool();
  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export interface AuditEventParams {
  adminId?: string | null;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}

export async function logAuditEvent(params: AuditEventParams, conn?: mysql.PoolConnection): Promise<void> {
  const auditId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const sql = `
    INSERT INTO audit_logs (id, admin_id, admin_email, action, entity_type, entity_id, details, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3))
  `;
  const values = [
    auditId,
    params.adminId || null,
    params.adminEmail,
    params.action,
    params.entityType,
    params.entityId || null,
    params.details || null,
    params.ipAddress || null,
  ];

  try {
    if (conn) {
      await conn.query(sql, values);
    } else {
      await execute(sql, values);
    }
  } catch (err) {
    // Non-blocking log failure output
    console.error('Failed to persist audit log entry:', err);
  }
}

export default {
  getPool,
  query,
  queryOne,
  execute,
  withTransaction,
  logAuditEvent,
};
