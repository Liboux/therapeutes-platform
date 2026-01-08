'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

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
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">Tableau de bord</h1>
                <p className="text-blue-100 mt-2">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Mon profil
              </h3>
              <p className="text-gray-600 mb-6">
                Gérez vos informations et votre présentation
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full font-semibold">
                Modifier mon profil
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Statistiques
              </h3>
              <p className="text-gray-600 mb-6">
                Consultez vos performances
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">🔒 Premium uniquement</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Abonnement
              </h3>
              <p className="text-gray-600 mb-4">
                Formule actuelle : <span className="font-bold">Gratuit</span>
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg w-full font-semibold">
                Passer à Premium
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">19.90 CHF/mois</p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aperçu rapide</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">0</p>
                <p className="text-gray-600 mt-2">Vues cette semaine</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">0</p>
                <p className="text-gray-600 mt-2">Contacts reçus</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600">85%</p>
                <p className="text-gray-600 mt-2">Profil complété</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">✓</p>
                <p className="text-gray-600 mt-2">Vérifié</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Conseil
            </h3>
            <p className="text-blue-800">
              Complétez votre profil à 100% pour augmenter votre visibilité auprès des clients !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}