import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 2]);

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
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}