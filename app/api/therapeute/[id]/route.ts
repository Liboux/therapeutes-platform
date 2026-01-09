import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    // Extraire l'ID de l'URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 1]);
    
    console.log('User ID extrait:', userId);
    
    const data = await request.json();
    console.log('Données reçues:', data);

    // Mettre à jour l'utilisateur (téléphone)
    if (data.telephone) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          telephone: data.telephone,
        }
      });
      console.log('Téléphone mis à jour');
    }

    // Mettre à jour le profil (description)
    if (data.profile?.description) {
      const profile = await prisma.therapistProfile.findUnique({
        where: { userId: userId }
      });

      if (profile) {
        await prisma.therapistProfile.update({
          where: { userId: userId },
          data: {
            description: data.profile.description,
          }
        });
        console.log('Description mise à jour');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });
    
  } catch (error: any) {
    console.error('Erreur complète:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}