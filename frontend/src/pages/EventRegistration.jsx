import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    registerNumber: '',
    email: user?.email || '',
    mobileNumber: '',
    department: 'Computer Science',
    year: '1st Year',
    gender: 'Male'
  });
  
  const [idCardFile, setIdCardFile] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        setEvent(res.data.data);
      } catch (err) {
        setError('Event not found or invalid URL');
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setIdCardFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCardFile) {
      setError('Please upload your ID Card image');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Upload ID Card Image
      const uploadData = new FormData();
      uploadData.append('image', idCardFile);
      
      const uploadRes = await axios.post('/api/uploads', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const idCardImageName = uploadRes.data.file;

      // 2. Submit Registration Data
      await axios.post(`/api/registrations/${eventId}`, {
        ...formData,
        idCardImage: idCardImageName
      });

      setSuccess(true);
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading Event Details...</div>;
  if (!event) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(`/events/${eventId}`)} 
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition"
      >
        <ArrowLeft size={16} /> Back to Event
      </button>

      <div className="glass rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
        
        {/* Header summarizing the selected event */}
        <div className="bg-primary/10 border-b border-primary/20 p-6 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Register for {event.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Event Date: {format(new Date(event.date), 'MMMM dd, yyyy')} at {event.time}
          </p>
          <div className="mt-4 inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-gray-100 dark:border-gray-700">
            Fee: {event.registrationFee === 0 ? 'Free' : `$${event.registrationFee}`}
          </div>
        </div>

        {success ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
            <p className="text-gray-600">You are being redirected to your dashboard...</p>
          </div>
        ) : (
          <div className="p-6 sm:p-10">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Register Number / Roll No</label>
                  <input
                    type="text"
                    name="registerNumber"
                    required
                    value={formData.registerNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    pattern="[0-9]{10}"
                    title="10 digit mobile number"
                    placeholder="1234567890"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                  <select
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Business/Arts">Business / Arts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Year / Semester</label>
                  <select
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="PG">PG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Upload ID Card</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-grow text-gray-700 dark:text-gray-300">
                      <Upload size={20} />
                      <span className="text-sm font-medium">Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {idCardFile && <span className="text-sm truncate max-w-[120px] font-medium text-gray-600 dark:text-gray-400">{idCardFile.name}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Please provide a clear image of your institutional ID card.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={submitting || event.availableSeats === 0}
                  className="btn-primary w-full"
                >
                  {submitting ? 'Processing Application...' : 'Submit Registration Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;
