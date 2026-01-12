'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Therapeute {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  subscriptionTier: string;
  profile: {
    type: string;
    specialisations: string[];
    langues: string[];
    experience: number;
    description: string;
    adresse: string;
    ville: string;
    npa: string;
    tarifIndividuel: number;
    tarifCouple: number;
    profilePhotoUrl: string | null;
  } | null;
}

export default function TherapeuteProfilePage() {
  const params = useParams();
  const therapeuteId = params.id;
  
  const [therapeute, setTherapeuete] = useState<Therapeute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTherapeuteData();
  }, []);

  const loadTherapeuteData = async () => {
    try {
      const response = await fetch(`/api/therapeute/${therapeuteId}`);
      const data = await response.json();
      
      if (data.success) {
        setTherapeuete(data.user);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!therapeute) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thérapeute non trouvé</h2>
            <a href="/recherche" className="text-blue-600 hover:underline">
              Retour à la recherche
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
                {therapeute.profile?.profilePhotoUrl ? (
                  <img 
                    src={therapeute.profile.profilePhotoUrl} 
                    alt={therapeute.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{therapeute.nom}</h1>
                <p className="text-xl text-blue-100 mb-4">{therapeute.profile?.type}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {therapeute.profile?.specialisations.map((spec, idx) => (
                    <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-blue-100">
                  <span>📍 {therapeute.profile?.ville}</span>
                  {therapeute.profile?.experience && (
                    <span>💼 {therapeute.profile.experience} ans d&apos;expérience</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="md:col-span-2 space-y-8">
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {therapeute.profile?.description || 'Aucune description disponible'}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Spécialisations</h2>
                <div className="grid grid-cols-2 gap-3">
                  {therapeute.profile?.specialisations.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-lg">
                      <span className="text-blue-600">✓</span>
                      <span className="text-gray-800 font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Langues parlées</h2>
                <div className="flex flex-wrap gap-2">
                  {therapeute.profile?.langues.map((langue, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                      🗣️ {langue}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                    <a 
                      href={`tel:${therapeute.telephone}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                    >
                      📞 {therapeute.telephone}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a 
                      href={`mailto:${therapeute.email}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold break-all flex items-center gap-2"
                    >
                      ✉️ {therapeute.email}
                    </a>
                  </div>

                  {therapeute.profile?.adresse && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cabinet</p>
                      <p className="text-gray-800">
                        {therapeute.profile.adresse}<br />
                        {therapeute.profile.npa} {therapeute.profile.ville}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href={`tel:${therapeute.telephone}`}
                    className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                  >
                    📞 Appeler
                  </a>
                  
                  <a
                    href={`mailto:${therapeute.email}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
                  >
                    ✉️ Envoyer un email
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tarifs</h2>
                
                <div className="space-y-3">
                  {therapeute.profile?.tarifIndividuel && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Séance individuelle</span>
                      <span className="text-xl font-bold text-gray-900">
                        {therapeute.profile.tarifIndividuel} CHF
                      </span>
                    </div>
                  )}
                  
                  {therapeute.profile?.tarifCouple && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Séance couple</span>
                      <span className="text-xl font-bold text-gray-900">
                        {therapeute.profile.tarifCouple} CHF
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  💳 Paiement accepté : Espèces, carte, facture
                </p>
              </div>

              {therapeute.subscriptionTier === 'premium' && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md p-4 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-yellow-900 font-bold">Profil Premium</p>
                  <p className="text-xs text-yellow-800 mt-1">Thérapeute vérifié</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <a 
              href="/recherche"
              className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
            >
              ← Retour à la recherche
            </a>
          </div>
        </div>
      </div>
    </>
  );
}