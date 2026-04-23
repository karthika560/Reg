import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <nav className="fixed w-full z-50 glass border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">EventHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition">Events</Link>
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition flex items-center gap-1">
                  <User size={18} /> Dashboard
                </Link>
                <button onClick={logout} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition">
                  <LogOut size={18}/> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition font-medium">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/events" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Events</Link>
             <button onClick={toggleTheme} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Toggle Theme</button>
             {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Dashboard</Link>
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-500">Logout</button>
                </>
             ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-blue-600">Register</Link>
                </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
