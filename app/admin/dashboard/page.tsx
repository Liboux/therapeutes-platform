'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Therapeute {
  id: number;
  email: string;
  nom: string;
  telephone: string;
  verificationStatus: string;
  verified: boolean;
  subscriptionTier: string;
  createdAt: string;
  profile: {
    type: string;
    ville: string;
    specialisations: string[];
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [therapeutes, setTherapeuetes] = useState<Therapeute[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // Vérifier si admin connecté
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      router.push('/admin/login');
      return;
    }

    // Charger les thérapeutes
    loadTherapeuetes();
  }, [router]);

  const loadTherapeuetes = async () => {
    try {
      const response = await fetch('/api/admin/therapeutes');
      const data = await response.json();
      
      if (data.success) {
        setTherapeuetes(data.therapeutes);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Approuver ce thérapeute ?')) return;

    try {
      const response = await fetch(`/api/admin/therapeutes/${id}/approve`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Thérapeute approuvé !');
        loadTherapeuetes();
      } else {
        alert('❌ Erreur : ' + result.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Refuser ce thérapeute ? Cette action est irréversible.')) return;

    try {
      const response = await fetch(`/api/admin/therapeutes/${id}/reject`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Thérapeute refusé');
        loadTherapeuetes();
      } else {
        alert('❌ Erreur : ' + result.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors du refus');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const pendingTherapeuetes = therapeutes.filter(t => t.verificationStatus === 'pending');
  const approvedTherapeuetes = therapeutes.filter(t => t.verificationStatus === 'approved');
  const rejectedTherapeuetes = therapeutes.filter(t => t.verificationStatus === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🔐 Administration</h1>
              <p className="text-gray-300 mt-1">Gestion des thérapeutes</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">En attente</p>
            <p className="text-4xl font-bold text-orange-600">{pendingTherapeuetes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Approuvés</p>
            <p className="text-4xl font-bold text-green-600">{approvedTherapeuetes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Refusés</p>
            <p className="text-4xl font-bold text-red-600">{rejectedTherapeuetes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-4xl font-bold text-blue-600">{therapeutes.length}</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-t-lg shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'pending'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⏳ En attente ({pendingTherapeuetes.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'approved'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✓ Approuvés ({approvedTherapeuetes.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'rejected'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✗ Refusés ({rejectedTherapeuetes.length})
            </button>
          </div>

          {/* Liste */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingTherapeuetes.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    Aucun thérapeute en attente
                  </p>
                ) : (
                  pendingTherapeuetes.map((therapeute) => (
                    <div key={therapeute.id} className="border rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{therapeute.nom}</h3>
                          <p className="text-gray-600">{therapeute.email}</p>
                          <p className="text-gray-600">{therapeute.telephone}</p>
                          
                          {therapeute.profile && (
                            <div className="mt-3">
                              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
                                {therapeute.profile.type}
                              </span>
                              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                📍 {therapeute.profile.ville}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-500 mt-2">
                            Inscrit le {new Date(therapeute.createdAt).toLocaleDateString('fr-CH')}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(therapeute.id)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
                          >
                            ✓ Approuver
                          </button>
                          <button
                            onClick={() => handleReject(therapeute.id)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold"
                          >
                            ✗ Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'approved' && (
              <div className="space-y-4">
                {approvedTherapeuetes.map((therapeute) => (
                  <div key={therapeute.id} className="border rounded-lg p-6 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{therapeute.nom}</h3>
                        <p className="text-gray-600">{therapeute.email}</p>
                        <p className="text-gray-600">{therapeute.telephone}</p>
                        
                        {therapeute.profile && (
                          <div className="mt-2">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {therapeute.profile.type}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ml-2 ${
                              therapeute.subscriptionTier === 'premium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {therapeute.subscriptionTier === 'premium' ? '⭐ Premium' : '🆓 Gratuit'}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => router.push(`/admin/therapeutes/${therapeute.id}/edit`)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        ✏️ Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rejected' && (
              <div className="space-y-4">
                {rejectedTherapeuetes.map((therapeute) => (
                  <div key={therapeute.id} className="border rounded-lg p-6 bg-red-50">
                    <h3 className="text-xl font-bold text-gray-900">{therapeute.nom}</h3>
                    <p className="text-gray-600">{therapeute.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}