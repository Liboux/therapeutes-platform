import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer un thérapeute
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 1]);

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
        ...user,
        profile: user.profile ? {
          ...user.profile,
          specialisations: JSON.parse(user.profile.specialisations),
          langues: JSON.parse(user.profile.langues)
        } : null
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

// PUT - Mettre à jour un thérapeute
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = parseInt(pathParts[pathParts.length - 1]);
    
    const data = await request.json();

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        subscriptionTier: data.subscriptionTier,
        verified: data.verified,
        verificationStatus: data.verificationStatus,
      }
    });

    // Mettre à jour le profil
    if (data.profile) {
      await prisma.therapistProfile.update({
        where: { userId: userId },
        data: {
          type: data.profile.type,
          specialisations: JSON.stringify(data.profile.specialisations),
          langues: JSON.stringify(data.profile.langues),
          experience: data.profile.experience,
          description: data.profile.description,
          adresse: data.profile.adresse,
          ville: data.profile.ville,
          npa: data.profile.npa,
          tarifIndividuel: data.profile.tarifIndividuel,
          tarifCouple: data.profile.tarifCouple,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}