import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Users, User as UserIcon, Tag, CheckCircle2, DollarSign, Award } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        setError('Event not found');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      setError('Admins cannot register for events.');
      return;
    }

    navigate(`/register-event/${id}`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!event) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="h-64 md:h-96 w-full bg-gray-200 dark:bg-gray-800 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          {event.bannerImage === 'no-photo.jpg' ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
               <Calendar className="w-20 h-20 text-gray-400" />
            </div>
          ) : (
            <img src={`http://localhost:5000/uploads/${event.bannerImage}`} alt={event.title} className="w-full h-full object-cover" />
          )}
          
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <span className="bg-primary px-4 py-1.5 rounded-full text-white text-sm font-bold uppercase tracking-wider mb-4 inline-block">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About the Event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <UserIcon className="text-blue-600" /> Organized By
              </h3>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">{event.organizer}</p>
            </section>

            {event.sponsors && event.sponsors.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="text-blue-600" /> Event Sponsors
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.sponsors.map((sponsor, index) => {
                    let tierConfig = { badgeClass: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300', iconColor: 'text-gray-500' };
                    if (sponsor.tier === 'Platinum') tierConfig = { badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-[0_0_15px_rgba(79,70,229,0.2)]', iconColor: 'text-indigo-500' };
                    if (sponsor.tier === 'Gold') tierConfig = { badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-[0_0_10px_rgba(234,179,8,0.2)]', iconColor: 'text-yellow-500' };
                    if (sponsor.tier === 'Silver') tierConfig = { badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700', iconColor: 'text-slate-400' };
                    if (sponsor.tier === 'Bronze') tierConfig = { badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-900', iconColor: 'text-orange-500' };

                    return (
                      <div key={index} className={`flex flex-col items-center justify-center p-6 rounded-xl border ${tierConfig.badgeClass} transition transform hover:-translate-y-1 hover:shadow-lg`}>
                         <Award className={`w-8 h-8 mb-3 ${tierConfig.iconColor}`} />
                         <span className="font-bold text-center text-lg">{sponsor.name}</span>
                         <span className="text-xs uppercase tracking-widest font-semibold mt-1 opacity-80">{sponsor.tier}</span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Availability</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {event.availableSeats} / {event.totalSeats} seats left
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Registration Fee</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {event.registrationFee === 0 ? 'Free' : `$${event.registrationFee}`}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                {error && <div className="text-red-500 text-sm mb-4 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
                
                <button
                  onClick={handleRegister}
                  disabled={event.availableSeats === 0}
                  className={`w-full py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center ${
                    event.availableSeats === 0 
                      ? 'bg-slate-400 text-white cursor-not-allowed shadow-none'
                      : 'btn-primary'
                  }`}
                >
                  {event.availableSeats === 0 
                      ? 'Sold Out' 
                      : event.registrationFee === 0 
                        ? 'Proceed to Register' 
                        : `Proceed to Payment - $${event.registrationFee}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
