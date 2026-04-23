const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin'
    });

    // Create Student User
    const student = await User.create({
      name: 'John Doe',
      email: 'student@college.edu',
      password: 'password123',
      role: 'student'
    });

    // Create Events
    await Event.create([
      {
        title: 'Future of AI Symposium',
        description: 'A comprehensive 2-day technical event covering Artificial Intelligence, Neural Networks, and Web3 trends. Features industry experts and open source contributors.',
        category: 'Technical',
        date: new Date('2026-06-15'),
        time: '09:00 AM',
        venue: 'Main Auditorium',
        organizer: 'Computer Science Dept',
        totalSeats: 200,
        registrationFee: 25,
        bannerImage: 'technical_cover_1776571611075.png',
        createdBy: admin._id
      },
      {
        title: 'Cultural Fest 2026',
        description: 'Join us for a mesmerizing night of music, traditional dance, and drama performances by the talented artists of our college.',
        category: 'Cultural',
        date: new Date('2026-05-20'),
        time: '05:00 PM',
        venue: 'Open Air Theatre',
        organizer: 'Arts and Cultural Club',
        totalSeats: 500,
        registrationFee: 10,
        bannerImage: 'cultural_cover_1776571592751.png',
        createdBy: admin._id
      },
      {
        title: 'React & Node.js Workshop',
        description: 'Intensive hands-on workshop on building full-stack applications using the MERN stack. Perfect for beginners and intermediates.',
        category: 'Workshop',
        date: new Date('2026-05-05'),
        time: '10:00 AM',
        venue: 'Computer Lab 3',
        organizer: 'Coding Club',
        totalSeats: 60,
        registrationFee: 5,
        bannerImage: 'workshop_cover_1776571377049.png',
        createdBy: admin._id
      },
      {
        title: 'Leadership & Management Seminar',
        description: 'An insightful seminar by fortune 500 leaders on corporate management, effective communication, and networking in the modern age.',
        category: 'Seminar',
        date: new Date('2026-06-01'),
        time: '02:00 PM',
        venue: 'Conference Hall A',
        organizer: 'Business Department',
        totalSeats: 150,
        registrationFee: 0,
        bannerImage: 'seminar_cover_1776571395860.png',
        createdBy: admin._id
      },
      {
        title: 'Inter-College Sports Meet',
        description: 'The biggest athletic competition of the year! Join us for track events, basketball, football, and more. Show your college spirit!',
        category: 'Sports',
        date: new Date('2026-07-10'),
        time: '08:00 AM',
        venue: 'University Sports Complex',
        organizer: 'Sports Committee',
        totalSeats: 1000,
        registrationFee: 15,
        bannerImage: 'sports_cover_1776571863727.png',
        createdBy: admin._id
      },
      {
        title: 'Alumni Mixer & Networking Night',
        description: 'A wonderful evening for graduating students to connect with successful alumni members. Dress code is semi-formal.',
        category: 'Other',
        date: new Date('2026-07-25'),
        time: '06:30 PM',
        venue: 'Grand Banquet Hall',
        organizer: 'Alumni Association',
        totalSeats: 300,
        registrationFee: 20,
        bannerImage: 'other_cover_1776571882065.png',
        createdBy: admin._id
      }
    ]);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
