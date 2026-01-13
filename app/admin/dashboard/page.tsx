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
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify-admin');
      const data = await response.json();

      if (!data.success) {
        router.push('/admin/login');
        return;
      }

      setAuthenticated(true);
      loadTherapeuetes();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      router.push('/admin/login');
    }
  };

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin-logout', {
        method: 'POST'
      });
      
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminEmail');
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      router.push('/admin/login');
    }
  };

  if (loading || !authenticated) {
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🔐 Administration</h1>
              <p className="text-gray-400 mt-1">Gestion des thérapeutes</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">En attente</p>
            <p className="text-4xl font-bold text-orange-600">{pendingTherapeuetes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Approuvés</p>
            <p className="text-4xl font-bold text-green-600">{approvedTherapeuetes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-1">Refusés</p>
            <p className="text-4xl font-bold text-red-600">{rejectedTherapeuetes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-4xl font-bold text-blue-600">{therapeutes.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-t-lg shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'pending'
                  ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              ⏳ En attente ({pendingTherapeuetes.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'approved'
                  ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              ✓ Approuvés ({approvedTherapeuetes.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'rejected'
                  ? 'border-b-2 border-red-600 text-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              ✗ Refusés ({rejectedTherapeuetes.length})
            </button>
          </div>

          <div className="p-6 bg-gray-50">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingTherapeuetes.length === 0 ? (
                  <p className="text-center text-gray-500 py-12 bg-white rounded-lg">
                    Aucun thérapeute en attente
                  </p>
                ) : (
                  pendingTherapeuetes.map((therapeute) => (
                    <div key={therapeute.id} className="bg-white border-l-4 border-orange-500 rounded-lg p-6 hover:shadow-md transition">
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
                  <div key={therapeute.id} className="bg-white border-l-4 border-green-500 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{therapeute.nom}</h3>
                        <p className="text-gray-600">{therapeute.email}</p>
                        {therapeute.profile && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mt-2">
                            {therapeute.profile.type}
                          </span>
                        )}
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ml-2 mt-2 ${
                          therapeute.subscriptionTier === 'premium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {therapeute.subscriptionTier === 'premium' ? '⭐ Premium' : '🆓 Gratuit'}
                        </span>
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
                  <div key={therapeute.id} className="bg-white border-l-4 border-red-500 rounded-lg p-6">
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