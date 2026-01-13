'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import PhoneInput from '@/components/PhoneInput';


export default function InscriptionPage() {
  const router = useRouter();
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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
    latitude: null as number | null,
    longitude: null as number | null,
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

  const handleAddressSelect = (addressData: {
    adresse: string;
    ville: string;
    npa: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData({
      ...formData,
      adresse: addressData.adresse,
      ville: addressData.ville,
      npa: addressData.npa,
      latitude: addressData.latitude,
      longitude: addressData.longitude
    });
  };

  const validateStep = (step: number): boolean => {
    setError('');

    if (step === 1) {
      if (!formData.email || !formData.password || !formData.nom || !formData.telephone) {
        setError('Tous les champs marqués * sont obligatoires');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Email invalide');
        return false;
      }

      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return false;
      }

      // Validation téléphone international (commence par + suivi de chiffres et espaces)
      const phoneRegex = /^\+\d+\s[\d\s]+$/;
      if (!phoneRegex.test(formData.telephone) || formData.telephone.replace(/\D/g, '').length < 8) {
        setError('Format de téléphone invalide');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.type || !formData.numeroRCC) {
        setError('Tous les champs marqués * sont obligatoires');
        return false;
      }

      if (formData.specialisations.length === 0) {
        setError('Sélectionnez au moins une spécialisation');
        return false;
      }

      if (formData.langues.length === 0) {
        setError('Sélectionnez au moins une langue');
        return false;
      }

      const rccRegex = /^\d{13}$/;
      if (!rccRegex.test(formData.numeroRCC.replace(/\s/g, ''))) {
        setError('Le numéro RCC/GLN doit contenir exactement 13 chiffres');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.description || !formData.adresse || !formData.ville || !formData.npa) {
        setError('Tous les champs marqués * sont obligatoires');
        return false;
      }

      const npaRegex = /^\d{4}$/;
      if (!npaRegex.test(formData.npa)) {
        setError('Le NPA doit contenir 4 chiffres');
        return false;
      }

      // Ne plus forcer l'autocomplétion GPS - permettre saisie manuelle
      // On garde quand même les coordonnées si elles existent
    }

    return true;
  };

  const etapeSuivante = () => {
    if (validateStep(etape)) {
      setEtape(etape + 1);
    }
  };

  const etapePrecedente = () => setEtape(etape - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        setSuccess(true);
        setTimeout(() => {
          router.push('/connexion');
        }, 3000);
      } else {
        setError(result.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription réussie !</h2>
            <p className="text-gray-600">
              Votre profil sera vérifié sous 24-48h. Vous recevrez un email de confirmation.
            </p>
          </div>
        </div>
      </>
    );
  }

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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {etape === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Créez votre compte</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email * <span className="text-xs text-gray-500">(exemple@mail.com)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe * <span className="text-xs text-gray-500">(min. 8 caractères)</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. Sophie Martin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <PhoneInput
                      value={formData.telephone}
                      onChange={(value) => setFormData({...formData, telephone: value})}
                      required
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
                      required
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro RCC / GLN * <span className="text-xs text-gray-500">(13 chiffres)</span>
                    </label>
                    <input
                      type="text"
                      name="numeroRCC"
                      value={formData.numeroRCC}
                      onChange={handleChange}
                      required
                      maxLength={13}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="7601234567890"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Numéro d&apos;identification professionnel suisse (13 chiffres)
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
                    {formData.specialisations.length === 0 && (
                      <p className="text-xs text-red-600 mt-1">Sélectionnez au moins une spécialisation</p>
                    )}
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
                    {formData.langues.length === 0 && (
                      <p className="text-xs text-red-600 mt-1">Sélectionnez au moins une langue</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Années d&apos;expérience</label>
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
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Présentez votre approche thérapeutique..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse du cabinet *
                      <span className="text-xs text-gray-500 ml-2">(Tapez pour voir les suggestions)</span>
                    </label>
                    <AddressAutocomplete 
                      onAddressSelect={handleAddressSelect}
                      defaultValue={formData.adresse}
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Sélectionnez une adresse dans la liste pour auto-remplir, ou saisissez manuellement ci-dessous
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NPA *</label>
                      <input
                        type="text"
                        name="npa"
                        value={formData.npa}
                        onChange={handleChange}
                        maxLength={4}
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
                    disabled={loading}
                    className={`flex-1 py-3 rounded-lg font-semibold text-white disabled:opacity-50 ${
                      formData.abonnement === 'premium' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Inscription...' : (formData.abonnement === 'premium' ? 'Finaliser et payer' : 'Créer mon profil gratuit')}
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