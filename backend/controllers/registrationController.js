const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');

// @desc    Register for event
// @route   POST /api/registrations/:eventId
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: req.params.eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    const { fullName, registerNumber, email, mobileNumber, department, year, gender, idCardImage } = req.body;

    const registration = await Registration.create({
      user: req.user.id,
      event: req.params.eventId,
      fullName,
      registerNumber,
      email,
      mobileNumber,
      department,
      year,
      gender,
      idCardImage,
      registrationId: `REG-${uuidv4().substring(0, 8).toUpperCase()}`
    });

    // Decrease available seats
    event.availableSeats -= 1;
    await event.save();

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's registered events
// @route   GET /api/registrations/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title date time venue bannerImage')
      .sort('-registeredAt');
    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to cancel this registration' });
    }

    const event = await Event.findById(registration.event);
    
    await registration.deleteOne();

    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
