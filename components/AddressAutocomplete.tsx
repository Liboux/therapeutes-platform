'use client';

import { useRef, useEffect } from 'react';

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    adresse: string;
    ville: string;
    npa: string;
    latitude: number;
    longitude: number;
  }) => void;
  defaultValue?: string;
}

export default function AddressAutocomplete({ onAddressSelect, defaultValue }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const loadGoogleMaps = () => {
      if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', initAutocomplete);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=fr`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
        console.error('Google Maps Places non disponible');
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ch' },
        fields: ['address_components', 'geometry', 'formatted_address'],
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.address_components || !place.geometry.location) {
          console.error('Informations d\'adresse incomplètes');
          return;
        }

        let streetNumber = '';
        let route = '';
        let locality = '';
        let postalCode = '';

        place.address_components.forEach((component) => {
          const types = component.types;

          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            route = component.long_name;
          }
          if (types.includes('locality')) {
            locality = component.long_name;
          }
          if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        const adresse = `${route} ${streetNumber}`.trim();

        // Extraire les coordonnées (lat() et lng() sont toujours des fonctions)
        const location = place.geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();

        console.log('Adresse sélectionnée:', {
          adresse,
          ville: locality,
          npa: postalCode,
          latitude,
          longitude
        });

        onAddressSelect({
          adresse,
          ville: locality,
          npa: postalCode,
          latitude,
          longitude
        });

        onAddressSelect({
          adresse,
          ville: locality,
          npa: postalCode,
          latitude,
          longitude
        });
      });
    };

    setTimeout(loadGoogleMaps, 100);
  }, [onAddressSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Commencez à taper votre adresse..."
    />
  );
}