'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function InscriptionPage() {
  const [etape, setEtape] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    telephone: '',
    numeroRCC: '',
    type: '',
    specialisations: [] as string[],
    langues: [] as string[],
    experience: '',
    description: '',
    adresse: '',
    ville: '',
    npa: '',
    tarifIndividuel: '',
    tarifCouple: '',
    abonnement: 'gratuit'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckbox = (name: string, value: string) => {
    const currentArray = formData[name as keyof typeof formData] as string[];
    if (currentArray.includes(value)) {
      setFormData({
        ...formData,
        [name]: currentArray.filter(item => item !== value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: [...currentArray, value]
      });
    }
  };

  const etapeSuivante = () => setEtape(etape + 1);
  const etapePrecedente = () => setEtape(etape - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Inscription réussie !\n\n📋 Votre profil sera vérifié par notre équipe sous 24-48h.\nVous recevrez un email de confirmation une fois validé.');
        window.location.href = '/';
      } else {
        alert('❌ Erreur : ' + result.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'inscription');
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Étape {etape} sur 4</span>
              <span className="text-sm text-gray-500">{etape * 25}% complété</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${etape * 25}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Inscription Thérapeute
            </h1>

            {etape === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Créez votre compte</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. Sophie Martin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+41 21 123 45 67"
                    />
                  </div>
                </div>

                <button
                  onClick={etapeSuivante}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Continuer
                </button>
              </div>
            )}

            {etape === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Informations professionnelles</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de thérapeute *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="psychologue">Psychologue</option>
                      <option value="psychotherapeute">Psychothérapeute</option>
                      <option value="psychiatre">Psychiatre</option>
                      <option value="osteopathe">Ostéopathe</option>
                      <option value="naturopathe">Naturopathe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro RCC / GLN *</label>
                    <input
                      type="text"
                      name="numeroRCC"
                      value={formData.numeroRCC}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="7601234567890"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Numéro d'identification professionnel suisse (RCC ou GLN)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialisations *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Anxiété', 'Dépression', 'Burnout', 'Couple', 'Enfants', 'Trauma'].map((spec) => (
                        <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.specialisations.includes(spec)}
                            onChange={() => handleCheckbox('specialisations', spec)}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langues parlées *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Français', 'Allemand', 'Anglais', 'Italien'].map((langue) => (
                        <label key={langue} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.langues.includes(langue)}
                            onChange={() => handleCheckbox('langues', langue)}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm">{langue}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={etapePrecedente} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">
                    Retour
                  </button>
                  <button onClick={etapeSuivante} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {etape === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Votre profil public</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Présentez votre approche thérapeutique..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse du cabinet *</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Rue de la Gare 15"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NPA *</label>
                      <input
                        type="text"
                        name="npa"
                        value={formData.npa}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1003"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                      <input
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Lausanne"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarif individuel (CHF)</label>
                      <input
                        type="number"
                        name="tarifIndividuel"
                        value={formData.tarifIndividuel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarif couple (CHF)</label>
                      <input
                        type="number"
                        name="tarifCouple"
                        value={formData.tarifCouple}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={etapePrecedente} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">
                    Retour
                  </button>
                  <button onClick={etapeSuivante} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {etape === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Choisissez votre formule</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => setFormData({...formData, abonnement: 'gratuit'})}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition ${
                      formData.abonnement === 'gratuit' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold">GRATUIT</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">0 CHF</p>
                      <p className="text-sm text-gray-500">pour toujours</p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span>Profil visible</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span>Sur la carte</li>
                      <li className="flex items-center text-gray-400"><span className="mr-2">✗</span>Réservation en ligne</li>
                      <li className="flex items-center text-gray-400"><span className="mr-2">✗</span>Statistiques</li>
                    </ul>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, abonnement: 'premium'})}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition relative ${
                      formData.abonnement === 'premium' ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                      RECOMMANDÉ
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold">PREMIUM</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">19.90 CHF</p>
                      <p className="text-sm text-gray-500">par mois</p>
                      <p className="text-xs text-green-600 font-semibold mt-1">Premier mois offert</p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span>Tout du gratuit</li>
                      <li className="flex items-center font-semibold"><span className="text-green-600 mr-2">✓</span>Réservation en ligne</li>
                      <li className="flex items-center font-semibold"><span className="text-green-600 mr-2">✓</span>Statistiques</li>
                      <li className="flex items-center font-semibold"><span className="text-green-600 mr-2">✓</span>Support compris</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={etapePrecedente} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 py-3 rounded-lg font-semibold text-white ${
                      formData.abonnement === 'premium' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {formData.abonnement === 'premium' ? 'Finaliser et payer' : 'Créer mon profil gratuit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}