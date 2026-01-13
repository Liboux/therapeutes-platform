import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { adresse, npa, ville } = await request.json();
    
    // Construire l'adresse complète
    const fullAddress = `${adresse}, ${npa} ${ville}, Switzerland`;
    
    console.log('Geocoding address:', fullAddress);
    
    // Appeler l'API Google Geocoding
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Geocoding response:', data);
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      
      return NextResponse.json({
        success: true,
        latitude: location.lat,
        longitude: location.lng
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Adresse introuvable'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Erreur geocoding:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}