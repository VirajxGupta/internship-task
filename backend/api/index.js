const app = require('../server');
const mongoose = require('mongoose');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('✅ Connected to MongoDB (serverless)');
      }
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  return app(req, res);
};
