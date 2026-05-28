const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Simulation = require('../models/Simulation');
const Log = require('../models/Log');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/powerplay';
    console.log(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Simulation.deleteMany({});
    await Log.deleteMany({});

    console.log('Seeding initial data...');

    // 1. Create Admins and Visitors
    const admin = await User.create({
      name: 'Cyber Arena Master',
      email: 'admin@powerplay.com',
      password: 'admin123',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'Shayan Visitor',
      email: 'shayan@visitor.com',
      password: 'shayan123',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Bob Ross',
      email: 'bob@gmail.com',
      password: 'visitor123',
      role: 'user',
    });

    const user3 = await User.create({
      name: 'Charlie Green',
      email: 'charlie@gmail.com',
      password: 'visitor123',
      role: 'user',
    });

    const user4 = await User.create({
      name: 'Diana Prince',
      email: 'diana@gmail.com',
      password: 'visitor123',
      role: 'user',
    });

    console.log('Seeded Users:');
    console.log(`- Admin: ${admin.email} (password: admin123)`);
    console.log(`- User: ${user1.email} (password: shayan123)`);
    console.log(`- User: ${user2.email} (password: visitor123)`);
    console.log(`- User: ${user3.email} (password: visitor123)`);
    console.log(`- User: ${user4.email} (password: visitor123)`);

    // 2. Seed Pending Bookings (Ready Queues) in different departments
    const bookingData = [
      // Reception (FCFS, Priority, RR)
      { userId: user1._id, department: 'reception', activity: 'Walk-in Ticket Counter', algorithm: 'FCFS', sessionTime: 8, priority: 3 },
      { userId: user2._id, department: 'reception', activity: 'VIP Member Registration', algorithm: 'Priority', sessionTime: 4, priority: 1 }, // VIP = High priority
      { userId: user3._id, department: 'reception', activity: 'Group Entry Counter', algorithm: 'FCFS', sessionTime: 12, priority: 4 },
      { userId: user4._id, department: 'reception', activity: 'Event Booking Inquiry', algorithm: 'RR', sessionTime: 6, priority: 2 },

      // Kids Zone (Priority, RR)
      { userId: user2._id, department: 'kids', activity: 'Trampoline Bounce rotation', algorithm: 'RR', sessionTime: 15, priority: 3 },
      { userId: user3._id, department: 'kids', activity: 'Cartoon VR Ride', algorithm: 'Priority', sessionTime: 10, priority: 1 }, // Child VIP
      { userId: user4._id, department: 'kids', activity: 'Mini Coaster Ride', algorithm: 'RR', sessionTime: 8, priority: 2 },

      // Adult Arena (FCFS, SJF, Priority)
      { userId: user1._id, department: 'adult', activity: 'Hyper bowling lane 4', algorithm: 'SJF', sessionTime: 25, priority: 3 },
      { userId: user2._id, department: 'adult', activity: 'Sci-fi Laser tag team arena', algorithm: 'Priority', sessionTime: 18, priority: 2 },
      { userId: user3._id, department: 'adult', activity: 'Professional Racing Simulator', algorithm: 'SJF', sessionTime: 12, priority: 4 },
      { userId: user4._id, department: 'adult', activity: 'VR Omni-directional Treadmill', algorithm: 'SJF', sessionTime: 15, priority: 1 },

      // Gaming PC Cafe (FCFS, SJF, Priority, RR)
      { userId: user1._id, department: 'gaming', activity: 'Gaming PC #04 Allocation', algorithm: 'RR', sessionTime: 30, priority: 3 },
      { userId: user2._id, department: 'gaming', activity: 'eSports Tournament Pool A', algorithm: 'Priority', sessionTime: 45, priority: 1 }, // Tournament matches have top priority!
      { userId: user3._id, department: 'gaming', activity: 'Demo Console Station', algorithm: 'FCFS', sessionTime: 15, priority: 4 },
      { userId: user4._id, department: 'gaming', activity: 'AAA Game Download Queue', algorithm: 'SJF', sessionTime: 20, priority: 5 }
    ];

    await Booking.create(bookingData);
    console.log(`Seeded ${bookingData.length} pending visitors across departments.`);

    // 3. Seed some Simulation logs to populate the Analytics comparison directly
    const simulations = [
      {
        userId: user1._id,
        algorithm: 'FCFS',
        processes: [
          { id: '1', name: 'PC Allocation 1', arrivalTime: 0, burstTime: 10, priority: 3, waitingTime: 0, turnaroundTime: 10, completionTime: 10 },
          { id: '2', name: 'PC Allocation 2', arrivalTime: 2, burstTime: 5, priority: 2, waitingTime: 8, turnaroundTime: 13, completionTime: 15 },
          { id: '3', name: 'PC Allocation 3', arrivalTime: 4, burstTime: 8, priority: 1, waitingTime: 11, turnaroundTime: 19, completionTime: 23 }
        ],
        ganttData: [
          { id: '1', name: 'PC Allocation 1', start: 0, end: 10 },
          { id: '2', name: 'PC Allocation 2', start: 10, end: 15 },
          { id: '3', name: 'PC Allocation 3', start: 15, end: 23 }
        ],
        averageWaitingTime: 6.3,
        averageTurnaroundTime: 14.0,
        cpuUtilization: 100.0,
        resourceSelected: 'Gaming PC 1'
      },
      {
        userId: user1._id,
        algorithm: 'SJF',
        processes: [
          { id: '1', name: 'VR Gear 1', arrivalTime: 0, burstTime: 15, priority: 2, waitingTime: 0, turnaroundTime: 15, completionTime: 15 },
          { id: '2', name: 'VR Gear 2', arrivalTime: 2, burstTime: 4, priority: 1, waitingTime: 13, turnaroundTime: 17, completionTime: 19 },
          { id: '3', name: 'VR Gear 3', arrivalTime: 4, burstTime: 8, priority: 3, waitingTime: 15, turnaroundTime: 23, completionTime: 27 }
        ],
        ganttData: [
          { id: '1', name: 'VR Gear 1', start: 0, end: 15 },
          { id: '2', name: 'VR Gear 2', start: 15, end: 19 },
          { id: '3', name: 'VR Gear 3', start: 19, end: 27 }
        ],
        averageWaitingTime: 9.3,
        averageTurnaroundTime: 18.3,
        cpuUtilization: 100.0,
        resourceSelected: 'VR Station 2'
      },
      {
        userId: user2._id,
        algorithm: 'Priority',
        processes: [
          { id: '1', name: 'Bowling 1', arrivalTime: 0, burstTime: 12, priority: 3, waitingTime: 12, turnaroundTime: 24, completionTime: 24 },
          { id: '2', name: 'Bowling 2', arrivalTime: 2, burstTime: 10, priority: 1, waitingTime: 0, turnaroundTime: 10, completionTime: 12 },
          { id: '3', name: 'Bowling 3', arrivalTime: 4, burstTime: 6, priority: 2, waitingTime: 20, turnaroundTime: 26, completionTime: 30 }
        ],
        ganttData: [
          { id: '2', name: 'Bowling 2', start: 0, end: 12 },
          { id: '1', name: 'Bowling 1', start: 12, end: 24 },
          { id: '3', name: 'Bowling 3', start: 24, end: 30 }
        ],
        averageWaitingTime: 10.7,
        averageTurnaroundTime: 20.0,
        cpuUtilization: 100.0,
        resourceSelected: 'Bowling Lane 1'
      },
      {
        userId: user3._id,
        algorithm: 'RR',
        processes: [
          { id: '1', name: 'Laser Tag 1', arrivalTime: 0, burstTime: 8, priority: 2, waitingTime: 8, turnaroundTime: 16, completionTime: 16 },
          { id: '2', name: 'Laser Tag 2', arrivalTime: 2, burstTime: 4, priority: 3, waitingTime: 6, turnaroundTime: 10, completionTime: 12 },
          { id: '3', name: 'Laser Tag 3', arrivalTime: 4, burstTime: 6, priority: 1, waitingTime: 8, turnaroundTime: 14, completionTime: 18 }
        ],
        ganttData: [
          { id: '1', name: 'Laser Tag 1', start: 0, end: 4 },
          { id: '2', name: 'Laser Tag 2', start: 4, end: 8 },
          { id: '3', name: 'Laser Tag 3', start: 8, end: 12 },
          { id: '1', name: 'Laser Tag 1', start: 12, end: 16 },
          { id: '3', name: 'Laser Tag 3', start: 16, end: 18 }
        ],
        averageWaitingTime: 7.3,
        averageTurnaroundTime: 13.3,
        cpuUtilization: 100.0,
        resourceSelected: 'Laser Tag Center'
      }
    ];

    await Simulation.create(simulations);
    console.log('Seeded baseline simulation logs.');

    // 4. Seed system Audit logs
    const logData = [
      { userId: admin._id, action: 'ADMIN_INIT', details: 'Power Play Arena System Initialized', ipAddress: '127.0.0.1' },
      { userId: user1._id, action: 'USER_SIGNUP', details: 'Visitor account created for Shayan Visitor', ipAddress: '127.0.0.1' },
      { userId: user2._id, action: 'USER_SIGNUP', details: 'Visitor account created for Bob Ross', ipAddress: '127.0.0.1' },
      { userId: user1._id, action: 'BOOKING_CREATE', details: 'Booking for gaming department created', ipAddress: '127.0.0.1' },
      { userId: admin._id, action: 'DATABASE_SEED', details: 'Database cleared and populated with seed dataset', ipAddress: '127.0.0.1' }
    ];

    await Log.create(logData);
    console.log('Seeded administrative activity logs.');

    console.log('Database Seeding Successful! All operations finished.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
