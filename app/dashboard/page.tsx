'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    telephone: '',
    description: ''
});

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ L\'image est trop volumineuse (max 5MB)');
    return;
  }

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      setProfileImage(result.imageUrl);
      alert('✅ Photo mise à jour avec succès !');
    } else {
      alert('❌ Erreur : ' + result.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors de l\'upload');
  } finally {
    setUploading(false);
  }
};

const handleSaveProfile = async () => {
  try {
    const userId = localStorage.getItem('userId');
    
    const response = await fetch(`/api/therapeute/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telephone: formData.telephone,
        profileImage: profileImage,
        profile: {
          description: formData.description
        }
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert('✅ Profil mis à jour avec succès !');
    } else {
      alert('❌ Erreur : ' + result.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors de la sauvegarde');
  }
};

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');

    if (!userId) {
      router.push('/connexion');
      return;
    }
    
    setUserEmail(email || '');
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    alert('Vous êtes déconnecté');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">Tableau de bord</h1>
                <p className="text-blue-100 mt-2">{userEmail}</p>
                <div className="flex gap-3 mt-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    🆓 Gratuit
                  </span>
                  <span className="px-3 py-1 bg-green-400/80 text-green-900 rounded-full text-sm font-semibold">
                    ✓ Vérifié
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveSection('overview')}
                className={`py-4 px-2 border-b-2 transition ${
                  activeSection === 'overview'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className={`py-4 px-2 border-b-2 transition ${
                  activeSection === 'profile'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                👤 Mon profil
              </button>
              <button
                onClick={() => setActiveSection('stats')}
                className={`py-4 px-2 border-b-2 transition ${
                  activeSection === 'stats'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📈 Statistiques
              </button>
              <button
                onClick={() => setActiveSection('subscription')}
                className={`py-4 px-2 border-b-2 transition ${
                  activeSection === 'subscription'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                💳 Abonnement
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Vue d'ensemble */}
          {activeSection === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-1">Vues cette semaine</p>
                  <p className="text-4xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-1">Contacts reçus</p>
                  <p className="text-4xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-1">Profil complété</p>
                  <p className="text-4xl font-bold text-purple-600">85%</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-sm text-gray-600 mb-1">Statut</p>
                  <p className="text-4xl font-bold text-orange-600">✓</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  💡 Conseil du jour
                </h3>
                <p className="text-blue-800">
                  Ajoutez une photo de profil et des photos de votre cabinet pour augmenter votre visibilité de 60% !
                </p>
              </div>
            </div>
          )}

          {/* Mon profil */}
          {activeSection === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h2>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo de profil
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl overflow-hidden">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt="Profil" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="photo-upload"
                          className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block ${
                            uploading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploading ? 'Upload en cours...' : 'Changer la photo'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG ou GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      placeholder="+41 21 123 45 67"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Présentez votre approche thérapeutique..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    💾 Sauvegarder les modifications
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Statistiques */}
          {activeSection === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques</h2>
              
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Fonctionnalité Premium
                </h3>
                <p className="text-gray-600 mb-6">
                  Accédez à des statistiques détaillées sur vos performances
                </p>
                <button
                  onClick={() => setActiveSection('subscription')}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg"
                >
                  Passer à Premium - 19.90 CHF/mois
                </button>
              </div>
            </div>
          )}

          {/* Abonnement */}
          {activeSection === 'subscription' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mon abonnement</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Gratuit (actuel) */}
                <div className="bg-white rounded-lg shadow-md p-8 border-2 border-blue-600">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">
                    ACTUEL
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-4">0 CHF</p>
                  <ul className="space-y-2 text-sm mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Profil visible
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> Sur la carte
                    </li>
                    <li className="flex items-center gap-2 text-gray-400">
                      <span>✗</span> Réservation en ligne
                    </li>
                    <li className="flex items-center gap-2 text-gray-400">
                      <span>✗</span> Statistiques
                    </li>
                  </ul>
                </div>

                {/* Premium */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-lg p-8 border-2 border-green-600 relative">
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    RECOMMANDÉ
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-1">19.90 CHF</p>
                  <p className="text-sm text-gray-600 mb-4">par mois</p>
                  
                  <ul className="space-y-2 text-sm mb-6">
                    <li className="flex items-center gap-2 font-semibold">
                      <span className="text-green-600">✓</span> Tout du gratuit
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      <span className="text-green-600">✓</span> Réservation en ligne
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      <span className="text-green-600">✓</span> Statistiques détaillées
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      <span className="text-green-600">✓</span> Support prioritaire
                    </li>
                  </ul>

                  <button
                    onClick={() => alert('🚧 Intégration Stripe à venir !\nPour l\'instant en développement.')}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-bold hover:shadow-xl transition"
                  >
                    Passer à Premium
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    🎁 Premier mois offert
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}