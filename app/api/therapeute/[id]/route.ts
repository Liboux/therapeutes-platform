import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 1]);

    console.log('GET therapeute ID:', userId);

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
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        telephone: user.telephone,
        subscriptionTier: user.subscriptionTier,
        profile: user.profile ? {
          type: user.profile.type,
          specialisations: JSON.parse(user.profile.specialisations),
          langues: JSON.parse(user.profile.langues),
          experience: user.profile.experience,
          description: user.profile.description,
          adresse: user.profile.adresse,
          ville: user.profile.ville,
          npa: user.profile.npa,
          tarifIndividuel: user.profile.tarifIndividuel,
          tarifCouple: user.profile.tarifCouple,
          profilePhotoUrl: user.profile.profilePhotoUrl
        } : null
      }
    });
  } catch (error) {
    console.error('Erreur GET:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 1]);
    const data = await request.json();
    
    console.log('PUT therapeute ID:', userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        telephone: data.telephone,
      }
    });

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