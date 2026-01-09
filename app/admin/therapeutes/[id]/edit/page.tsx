'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTherapeutePage() {
  const router = useRouter();
  const params = useParams();
  const therapeuteId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    subscriptionTier: 'free',
    verified: false,
    verificationStatus: 'pending',
    profile: {
      type: '',
      specialisations: [] as string[],
      langues: [] as string[],
      experience: 0,
      description: '',
      adresse: '',
      ville: '',
      npa: '',
      tarifIndividuel: 0,
      tarifCouple: 0,
    }
  });

  useEffect(() => {
    loadTherapeuteData();
  }, []);

  const loadTherapeuteData = async () => {
    try {
      const response = await fetch(`/api/admin/therapeutes/${therapeuteId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          nom: data.user.nom,
          email: data.user.email,
          telephone: data.user.telephone,
          subscriptionTier: data.user.subscriptionTier,
          verified: data.user.verified,
          verificationStatus: data.user.verificationStatus,
          profile: data.user.profile || formData.profile
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/therapeutes/${therapeuteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Profil mis à jour avec succès !');
        router.push('/admin/dashboard');
      } else {
        alert('❌ Erreur : ' + result.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckbox = (field: 'specialisations' | 'langues', value: string) => {
    const currentArray = formData.profile[field];
    if (currentArray.includes(value)) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [field]: currentArray.filter(item => item !== value)
        }
      });
    } else {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [field]: [...currentArray, value]
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="text-white hover:text-gray-300"
            >
              ← Retour
            </button>
            <h1 className="text-3xl font-bold">✏️ Modifier le profil</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          
          {/* Informations de base */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations de base</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Abonnement</label>
                  <select
                    value={formData.subscriptionTier}
                    onChange={(e) => setFormData({...formData, subscriptionTier: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="free">Gratuit</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut de vérification</label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => setFormData({...formData, verificationStatus: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Refusé</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Profil professionnel */}
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil professionnel</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de thérapeute</label>
                <select
                  value={formData.profile.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: {...formData.profile, type: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Spécialisations</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Anxiété', 'Dépression', 'Burnout', 'Couple', 'Enfants', 'Trauma'].map((spec) => (
                    <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.profile.specialisations.includes(spec)}
                        onChange={() => handleCheckbox('specialisations', spec)}
                        className="rounded"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Langues parlées</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Français', 'Allemand', 'Anglais', 'Italien'].map((langue) => (
                    <label key={langue} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.profile.langues.includes(langue)}
                        onChange={() => handleCheckbox('langues', langue)}
                        className="rounded"
                      />
                      <span className="text-sm">{langue}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.profile.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: {...formData.profile, description: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.profile.adresse}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: {...formData.profile, adresse: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPA</label>
                  <input
                    type="text"
                    value={formData.profile.npa}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: {...formData.profile, npa: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.profile.ville}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: {...formData.profile, ville: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarif individuel (CHF)</label>
                  <input
                    type="number"
                    value={formData.profile.tarifIndividuel}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: {...formData.profile, tarifIndividuel: parseFloat(e.target.value)}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarif couple (CHF)</label>
                  <input
                    type="number"
                    value={formData.profile.tarifCouple}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: {...formData.profile, tarifCouple: parseFloat(e.target.value)}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : '💾 Sauvegarder les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}