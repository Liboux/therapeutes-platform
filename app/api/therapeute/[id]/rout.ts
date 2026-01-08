import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = parseInt(params.id);
    const data = await request.json();
    
    console.log('User ID:', userId);
    console.log('Données reçues:', data);

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        telephone: data.telephone,
      }
    });

    // Mettre à jour le profil
    if (data.profile?.description) {
      await prisma.therapistProfile.updateMany({
        where: { userId: userId },
        data: {
          description: data.profile.description,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });
    
  } catch (error: any) {
    console.error('Erreur PUT:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = parseInt(params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      user: user
    });
    
  } catch (error: any) {
    console.error('Erreur GET:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}