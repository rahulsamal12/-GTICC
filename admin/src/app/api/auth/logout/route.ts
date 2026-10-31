import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  res.cookies.set('gticc_admin_token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
  return res;
}
