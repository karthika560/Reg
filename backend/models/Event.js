const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Workshop', 'Seminar', 'Cultural', 'Technical', 'Sports', 'Other'],
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please add an event time'],
  },
  venue: {
    type: String,
    required: [true, 'Please add a venue'],
  },
  organizer: {
    type: String,
    required: [true, 'Please add an organizer name'],
  },
  bannerImage: {
    type: String,
    default: 'no-photo.jpg',
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please specify total seats'],
  },
  availableSeats: {
    type: Number,
  },
  registrationFee: {
    type: Number,
    required: true,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  sponsors: [{
    name: { type: String, required: true },
    tier: { 
      type: String, 
      enum: ['Platinum', 'Gold', 'Silver', 'Bronze', 'Partner'],
      default: 'Partner' 
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate available seats before save
eventSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Event', eventSchema);
