import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/app/lib/verifyAdmin';

const prisma = new PrismaClient();

export async function GET() {
  // Vérifier l'authentification admin
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const therapeutes = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'therapist' },
          { role: 'null' }
        ]
      },
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Nombre de thérapeutes trouvés:', therapeutes.length);

    const formattedTherapists = therapeutes.map((user: any) => ({
      id: user.id,
      email: user.email,
      nom: user.nom,
      telephone: user.telephone,
      verified: user.verified,
      verificationStatus: user.verificationStatus,
      subscriptionTier: user.subscriptionTier,
      createdAt: user.createdAt,
      profile: user.profile ? {
        type: user.profile.type,
        ville: user.profile.ville,
        specialisations: JSON.parse(user.profile.specialisations || '[]')
      } : null
    }));

    return NextResponse.json({
      success: true,
      therapeutes: formattedTherapists
    });
  } catch (error: any) {
    console.error('Erreur complète:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}