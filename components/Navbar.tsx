export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            ThérapeutesVaud
          </div>

          {/* Menu */}
          <div className="flex gap-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Accueil
            </a>
            <a href="/recherche" className="text-gray-700 hover:text-blue-600">
              Rechercher
            </a>
            <a href="/connexion" className="text-gray-700 hover:text-blue-600">
              Connexion
            </a>
            <a href="/inscription" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Inscription Thérapeute
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}