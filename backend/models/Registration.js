const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  fullName: { type: String, required: true },
  registerNumber: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  idCardImage: { type: String, required: true },
  status: {
    type: String,
    enum: ['Approve', 'Pending', 'Cancelled', 'Attended'],
    default: 'Approve', // Auto approve by default as per simpler workflow
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  registrationId: {
    type: String,
    required: true,
    unique: true
  }
});

// Ensure a user can only register once per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
