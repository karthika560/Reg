import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Users, DollarSign } from 'lucide-react';

const EventsListing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data.data);
      } catch (error) {
        console.error('Error fetching events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ['All', 'Workshop', 'Seminar', 'Cultural', 'Technical', 'Sports', 'Other'];

  const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

  if (loading) return <div className="text-center py-20 text-xl text-gray-600">Loading events...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Discover Events</h1>
          <p className="text-gray-600 dark:text-gray-400">Find and register for the latest college events.</p>
        </div>
        
        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center justify-center cursor-pointer ${
                filter === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 text-lg">No events found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <Link to={`/events/${event._id}`} key={event._id} className="group">
              <div className="glass rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {event.bannerImage === 'no-photo.jpg' ? (
                     <div className="w-full h-full object-cover flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                       <Calendar className="w-12 h-12 text-gray-400" />
                     </div>
                  ) : (
                     <img src={`http://localhost:5000/uploads/${event.bannerImage}`} alt={event.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mt-4 flex-grow text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-semibold">{event.registrationFee === 0 ? 'Free' : `$${event.registrationFee}`}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Users size={16} className="text-gray-400" />
                      <span className={event.availableSeats === 0 ? 'text-red-500' : 'text-green-500'}>
                        {event.availableSeats > 0 ? `${event.availableSeats} seats left` : 'Sold Out'}
                      </span>
                    </div>
                    <span className="text-blue-600 text-sm font-medium group-hover:underline">View Details</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsListing;
