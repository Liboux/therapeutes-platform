import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const password = 'Admin2026!';
  const hash = await bcrypt.hash(password, 10);
  
  return NextResponse.json({
    password: password,
    hash: hash
  });
}