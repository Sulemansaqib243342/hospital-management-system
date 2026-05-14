import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <i className="ti ti-hospital text-white text-base"></i>
            </div>
            <Link to="/" className="font-bold text-xl text-primary-800 tracking-tight">SS pharmaceuticals</Link>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <NavLink to="/" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>About Us</NavLink>
            <NavLink to="/services" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Services</NavLink>
            <NavLink to="/contact" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Contact</NavLink>
          </nav>
          
          <div className="flex items-center">
            {user ? (
              <Link to="/dashboard" target="_blank" className="bg-primary-600 hover:bg-primary-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <i className="ti ti-layout-dashboard"></i> Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" target="_blank" className="bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <i className="ti ti-login"></i> Staff Portal
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <i className="ti ti-hospital text-white text-base"></i>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">SS pharmaceuticals</span>
            </div>
            <p className="text-sm text-gray-400">Providing world-class healthcare with state-of-the-art facilities and compassionate professionals.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Departments</h4>
            <ul className="space-y-2 text-sm">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Pediatrics</li>
              <li>Orthopedics</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><i className="ti ti-map-pin text-primary-400"></i> 123 Health Ave, Medical City</li>
              <li className="flex items-center gap-2"><i className="ti ti-phone text-primary-400"></i> +92 3293109487</li>
              <li className="flex items-center gap-2"><i className="ti ti-mail text-primary-400"></i> sulemansaqib34917@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} SS pharmaceuticals. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white"><i className="ti ti-brand-facebook text-xl"></i></a>
            <a href="#" className="hover:text-white"><i className="ti ti-brand-twitter text-xl"></i></a>
            <a href="#" className="hover:text-white"><i className="ti ti-brand-instagram text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
