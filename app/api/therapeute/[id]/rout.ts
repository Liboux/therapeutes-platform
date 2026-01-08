import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        telephone: user.telephone,
        subscriptionTier: user.subscriptionTier,
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}