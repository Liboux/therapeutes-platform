import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nom: data.nom,
        telephone: data.telephone,
        subscriptionTier: data.abonnement,
        verified: false,
        verificationStatus: 'pending',
        profile: {
          create: {
            type: data.type,
            specialisations: JSON.stringify(data.specialisations),
            langues: JSON.stringify(data.langues),
            experience: parseInt(data.experience) || null,
            description: data.description,
            adresse: data.adresse,
            ville: data.ville,
            npa: data.npa,
            latitude: data.latitude,        // NOUVEAU
            longitude: data.longitude,
            tarifIndividuel: parseFloat(data.tarifIndividuel) || null,
            tarifCouple: parseFloat(data.tarifCouple) || null,
          }
        }
      },
      include: {
        profile: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inscription réussie ! Votre profil sera vérifié sous 24-48h.',
      userId: user.id 
    });
    
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}