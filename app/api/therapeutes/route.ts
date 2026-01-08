import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer uniquement les thérapeutes vérifiés
    const therapeutes = await prisma.user.findMany({
      where: {
        verificationStatus: 'approved', // Uniquement les profils approuvés
      },
      include: {
        profile: true
      }
    });

    // Formater les données pour l'affichage
    const formattedTherapists = therapeutes.map(user => ({
      id: user.id,
      nom: user.nom,
      specialite: user.profile?.type || 'Non spécifié',
      ville: user.profile?.ville || 'Non spécifié',
      tarif: user.profile?.tarifIndividuel ? `${user.profile.tarifIndividuel} CHF` : 'Sur demande',
      photo: user.profile?.profilePhotoUrl || 'https://via.placeholder.com/150',
      latitude: user.profile?.latitude || 46.5197,
      longitude: user.profile?.longitude || 6.6323,
      telephone: user.telephone,
      description: user.profile?.description || '',
      adresse: user.profile?.adresse || '',
      npa: user.profile?.npa || '',
      specialisations: user.profile?.specialisations ? JSON.parse(user.profile.specialisations) : [],
      langues: user.profile?.langues ? JSON.parse(user.profile.langues) : [],
    }));

    return NextResponse.json({ 
      success: true, 
      therapeutes: formattedTherapists 
    });
    
  } catch (error) {
    console.error('Erreur récupération thérapeutes:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}