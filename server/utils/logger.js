const Log = require('../models/Log');

const logActivity = async (userId, action, details, req) => {
  try {
    let ipAddress = '';
    if (req) {
      ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    }
    await Log.create({
      userId,
      action,
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Logging Error:', err.message);
  }
};

module.exports = logActivity;
