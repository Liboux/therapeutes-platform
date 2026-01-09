import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Tentative de connexion admin:', email);

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('User trouvé:', user ? 'Oui' : 'Non');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier que c'est un admin
    console.log('Role:', user.role);
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Accès refusé - Pas un administrateur' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Mot de passe correct:', passwordMatch ? 'Oui' : 'Non');

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      nom: user.nom
    });

  } catch (error) {
    console.error('Erreur connexion admin:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}