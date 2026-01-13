import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/app/lib/verifyAdmin';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Vérifier l'authentification admin
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 2]);

    console.log('Refus du thérapeute ID:', userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        verified: false,
        verificationStatus: 'rejected'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thérapeute refusé'
    });
  } catch (error) {
    console.error('Erreur lors du refus:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}