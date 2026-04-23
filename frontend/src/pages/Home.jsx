import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Zap, Search } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 -z-10" />
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white leading-tight">
              Discover & Register for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                College Events
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
              The centralized platform to find workshops, seminars, and cultural fests. Say goodbye to manual queues and hello to digital registration.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/events" className="btn-primary">
                Explore Events
              </Link>
              {!user && (
                <>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why use EventHub?</h2>
            <p className="text-gray-600 dark:text-gray-400">Simplifying event management for both students and organizers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background glass p-8 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400">Search and filter upcoming events by category, date, and interests effortlessly.</p>
            </div>
            
            <div className="bg-background glass p-8 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Registration</h3>
              <p className="text-gray-600 dark:text-gray-400">One-click registration for events. No more filling out long paper forms.</p>
            </div>
            
            <div className="bg-background glass p-8 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Centralized Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">Track all your registered events, download QR tickets, and get notifications in one place.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
