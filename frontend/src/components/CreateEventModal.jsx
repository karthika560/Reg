import { useState } from 'react';
import axios from 'axios';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

const CreateEventModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    totalSeats: '',
    registrationFee: 0,
  });
  const [image, setImage] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const addSponsor = () => {
    setSponsors([...sponsors, { name: '', tier: 'Partner' }]);
  };

  const updateSponsor = (index, field, value) => {
    const updated = [...sponsors];
    updated[index][field] = value;
    setSponsors(updated);
  };

  const removeSponsor = (index) => {
    const updated = [...sponsors];
    updated.splice(index, 1);
    setSponsors(updated);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let bannerImage = 'no-photo.jpg';

      // 1. Upload Image if provided
      if (image) {
        const uploadData = new FormData();
        uploadData.append('image', image);
        const uploadRes = await axios.post('/api/uploads', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        bannerImage = uploadRes.data.file;
      }

      // 2. Create Event
      await axios.post('/api/events', {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        registrationFee: Number(formData.registrationFee),
        bannerImage,
        sponsors
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Event</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Technical">Technical</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  required
                  value={formData.organizer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Seats</label>
                <input
                  type="number"
                  name="totalSeats"
                  required
                  min="1"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Registration Fee ($)</label>
                <input
                  type="number"
                  name="registrationFee"
                  required
                  min="0"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                required
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Banner Image (Optional)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition flex-grow">
                  <Upload size={20} />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {image && <span className="text-sm truncate max-w-xs">{image.name}</span>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Sponsors & Partners</label>
                <button
                  type="button"
                  onClick={addSponsor}
                  className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-full transition"
                >
                  <Plus size={16} /> Add Sponsor
                </button>
              </div>

              <div className="space-y-3">
                {sponsors.map((sponsor, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-3 rounded-xl">
                    <input
                      type="text"
                      required
                      placeholder="Sponsor Name"
                      value={sponsor.name}
                      onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                      className="flex-grow px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <select
                      value={sponsor.tier}
                      onChange={(e) => updateSponsor(index, 'tier', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Partner">Partner</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSponsor(index)}
                      className="text-red-500 hover:text-red-700 p-2 bg-red-50 dark:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {sponsors.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-2">No sponsors added yet.</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
