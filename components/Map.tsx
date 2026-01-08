'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface Therapeute {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  therapeutes: Therapeute[];
}

export default function MapComponent({ therapeutes }: MapComponentProps) {
  // Centre de Lausanne
  const center = { lat: 46.5197, lng: 6.6323 };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        className="w-full h-full rounded-lg"
        mapId="therapeutes-map"
      >
        {/* Marqueurs pour chaque thérapeute */}
        {therapeutes.map((therapeute) => (
          <Marker
            key={therapeute.id}
            position={{ lat: therapeute.latitude, lng: therapeute.longitude }}
            title={therapeute.nom}
          />
        ))}
      </Map>
    </APIProvider>
  );
}