const crypto = require('crypto');

// Generate UUID token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate 6-digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Token expires time (15 minutes)
const getTokenExpires = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

module.exports = {
  generateToken,
  generateCode,
  getTokenExpires
};
