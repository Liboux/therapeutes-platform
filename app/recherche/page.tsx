'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MapComponent from '@/components/Map';

interface Therapeute {
  id: number;
  nom: string;
  specialite: string;
  ville: string;
  tarif: string;
  photo: string;
  latitude: number;
  longitude: number;
  telephone: string;
  description: string;
  adresse: string;
  npa: string;
  specialisations: string[];
  langues: string[];
}

export default function RecherchePage() {
  const [therapeutes, setTherapeuetes] = useState<Therapeute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les thérapeutes depuis l'API
    fetch('/api/therapeutes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTherapeuetes(data.therapeutes);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des thérapeutes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Thérapeutes disponibles ({therapeutes.length})
          </h1>

          {therapeutes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">
                Aucun thérapeute vérifié pour le moment
              </p>
              <p className="text-gray-500">
                Les profils sont en cours de vérification
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Liste des thérapeutes */}
              <div className="space-y-4">
                {therapeutes.map((therapeute) => (
                  <div key={therapeute.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex gap-4">
                      <img 
                        src={therapeute.photo} 
                        alt={therapeute.nom}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {therapeute.nom}
                        </h3>
                        <p className="text-gray-600">{therapeute.specialite}</p>
                        <p className="text-gray-500 text-sm">📍 {therapeute.ville}</p>
                        
                        {therapeute.specialisations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {therapeute.specialisations.slice(0, 3).map((spec, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-blue-600 font-semibold mt-2">
                          {therapeute.tarif} / séance
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <a href={`/therapeute/${therapeute.id}`}>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm w-full">
                            Voir profil
                          </button>
                        </a>
                        <a href={`tel:${therapeute.telephone}`}>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm w-full">
                            Appeler
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carte Google Maps */}
              <div className="bg-white rounded-lg shadow-md p-6 h-[600px] sticky top-8">
                <h3 className="text-xl font-semibold mb-4">Carte</h3>
                <div className="h-[520px]">
                  <MapComponent therapeutes={therapeutes} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}