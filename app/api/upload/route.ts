import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Créer un nom unique
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s/g, '-')}`;
    
    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder le fichier
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}