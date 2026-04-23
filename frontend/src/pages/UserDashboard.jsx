import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, Ticket, Download, Trash2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get('/api/registrations/my-registrations');
      setRegistrations(res.data.data);
    } catch (error) {
      console.error('Error fetching registrations', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (id) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      try {
        await axios.delete(`/api/registrations/${id}`);
        fetchRegistrations();
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling registration');
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 mb-10 flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-lg text-white">
          <User size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          <span className="inline-block mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide">
            Student Account
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Ticket className="text-blue-600" /> My Registered Events
        </h2>
      </div>

      {registrations.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
            <Calendar size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Events Yet</h3>
          <p className="text-gray-500 mb-6">You haven't registered for any events yet.</p>
          <Link to="/events" className="btn-primary inline-block">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrations.map(reg => (
             <div key={reg._id} className="glass rounded-2xl overflow-hidden shadow-md flex flex-col relative group">
               {/* Ticket Header Graphic */}
               <div className="h-3 bg-gradient-to-r from-blue-600 to-blue-400 w-full" />
               
               <div className="p-6 flex-grow">
                 <div className="flex justify-between items-start mb-4">
                   <h3 className="text-xl font-bold leading-tight">
                     <Link to={`/events/${reg.event._id}`} className="hover:text-blue-600 transition">{reg.event.title}</Link>
                   </h3>
                   <span className={`px-2 py-1 rounded text-xs font-bold ${reg.status === 'Approve' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                     {reg.status}
                   </span>
                 </div>
                 
                 <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6 border-l-2 border-blue-600/30 pl-3">
                    <p className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> {format(new Date(reg.event.date), 'MMM dd, yyyy')}</p>
                    <p className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> {reg.event.time}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {reg.event.venue}</p>
                 </div>

                 {/* QR Code Section */}
                 <div className="bg-white dark:bg-gray-100 p-4 rounded-xl flex items-center gap-4 mb-4 border border-dashed border-gray-300 grayscale group-hover:grayscale-0 transition duration-300">
                    <QRCodeSVG value={reg.registrationId} size={64} className="rounded" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Ticket ID</p>
                      <p className="text-gray-900 font-mono font-bold">{reg.registrationId}</p>
                    </div>
                 </div>
               </div>
               
               <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                 <button className="text-slate-500 hover:text-blue-600 transition flex items-center gap-1 text-sm font-medium">
                   <Download size={16} /> Download
                 </button>
                 <button onClick={() => cancelRegistration(reg._id)} className="text-red-500 hover:text-red-600 transition flex items-center gap-1 text-sm font-medium">
                   <Trash2 size={16} /> Cancel
                 </button>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
