import Navbar from '@/components/Navbar';
import MapComponent from '@/components/Map';

export default function RecherchePage() {
  // Données fictives avec coordonnées GPS
  const therapeutes = [
    {
      id: 1,
      nom: "Dr. Sophie Martin",
      specialite: "Psychologue FSP",
      ville: "Lausanne",
      tarif: "150 CHF",
      photo: "https://via.placeholder.com/150",
      latitude: 46.5197,
      longitude: 6.6323
    },
    {
      id: 2,
      nom: "Dr. Marc Dubois",
      specialite: "Psychothérapeute",
      ville: "Renens",
      tarif: "130 CHF",
      photo: "https://via.placeholder.com/150",
      latitude: 46.5369,
      longitude: 6.5881
    },
    {
      id: 3,
      nom: "Dr. Julie Blanc",
      specialite: "Psychiatre",
      ville: "Morges",
      tarif: "180 CHF",
      photo: "https://via.placeholder.com/150",
      latitude: 46.5108,
      longitude: 6.4989
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Thérapeutes disponibles
          </h1>

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
                      <p className="text-blue-600 font-semibold mt-2">
                        {therapeute.tarif} / séance
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Voir profil
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carte Google Maps */}
            <div className="bg-white rounded-lg shadow-md p-6 h-[600px]">
              <h3 className="text-xl font-semibold mb-4">Carte</h3>
              <div className="h-[520px]">
                <MapComponent therapeutes={therapeutes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}