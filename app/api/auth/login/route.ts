import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si le profil est approuvé
    if (user.verificationStatus !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Votre compte est en attente de vérification' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      nom: user.nom,
      subscriptionTier: user.subscriptionTier
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}