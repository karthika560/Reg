const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Get recent registrations
    const recentRegistrations = await Registration.find()
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort('-registeredAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        recentRegistrations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registrations for an event
// @route   GET /api/admin/events/:eventId/registrations
// @access  Private/Admin
exports.getEventRegistrations = async (req, res) => {
    try {
      const registrations = await Registration.find({ event: req.params.eventId })
        .populate('user', 'name email')
        .sort('-registeredAt');
        
      res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
