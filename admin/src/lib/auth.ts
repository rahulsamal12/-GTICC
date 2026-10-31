import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error('JWT_SECRET environment variable is missing or insufficiently secure (must be at least 32 characters).');
  }
  return secret.trim();
}

export interface AdminPayload {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'REVIEWER';
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminPayload;
  } catch {
    return null;
  }
}

export function getSessionAdmin(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get('gticc_admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
