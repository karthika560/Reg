import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, Ticket, TrendingUp, Plus, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import CreateEventModal from '../components/CreateEventModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const [statsRes, eventsRes] = await Promise.all([
           axios.get('/api/admin/stats'),
           axios.get('/api/events')
        ]);
        setStats(statsRes.data.data);
        setEvents(eventsRes.data.data);
    } catch (error) {
        console.error('Error fetching admin data', error);
    } finally {
        setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
      if(window.confirm('Delete this event?')) {
          try {
              await axios.delete(`/api/events/${id}`);
              fetchData();
          } catch(err) {
              alert('Error deleting event');
          }
      }
  };

  if (loading) return <div className="text-center py-20">Loading Admin Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}. Here's what's happening.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus size={20} /> Create Event
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center"><Users size={28} /></div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-extrabold">{stats?.totalUsers}</p>
            </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-xl flex items-center justify-center"><Calendar size={28} /></div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Events</p>
                <p className="text-3xl font-extrabold">{stats?.totalEvents}</p>
            </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-xl flex items-center justify-center"><Ticket size={28} /></div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Registrations</p>
                <p className="text-3xl font-extrabold">{stats?.totalRegistrations}</p>
            </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-xl flex items-center justify-center"><TrendingUp size={28} /></div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Growth</p>
                <p className="text-3xl font-extrabold">+12%</p>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Events Management */}
        <div className="md:col-span-2">
            <div className="glass rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h3 className="text-xl font-bold">Manage Events</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 text-left">
                                <th className="p-4 font-medium uppercase tracking-wider">Event Title</th>
                                <th className="p-4 font-medium uppercase tracking-wider text-center">Date</th>
                                <th className="p-4 font-medium uppercase tracking-wider text-center">Seats</th>
                                <th className="p-4 font-medium uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                    <td className="p-4">
                                        <p className="font-bold">{event.title}</p>
                                        <p className="text-xs text-gray-500">{event.category}</p>
                                    </td>
                                    <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(event.date), 'MM/dd/yyyy')}
                                    </td>
                                    <td className="p-4 text-center">
                                       <span className={`px-2 py-1 rounded text-xs font-bold ${event.availableSeats === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                          {event.availableSeats} / {event.totalSeats}
                                       </span>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"><Edit size={16} /></button>
                                        <button onClick={() => deleteEvent(event._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4">Recent Registrations</h3>
                <div className="space-y-4">
                    {stats?.recentRegistrations?.map(reg => (
                        <div key={reg._id} className="flex gap-4 items-start pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                                {reg.user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm">
                                    <span className="font-bold">{reg.user.name}</span> registered for <span className="font-bold text-primary">{reg.event.title}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{format(new Date(reg.registeredAt), 'MMM dd, hh:mm a')}</p>
                            </div>
                        </div>
                    ))}
                    {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) && (
                        <p className="text-gray-500 text-sm">No recent registrations.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
      <CreateEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default AdminDashboard;
