import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token');

  if (!adminToken) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    };
  }

  return { authorized: true };
}