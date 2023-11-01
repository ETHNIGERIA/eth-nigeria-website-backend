const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv');

const secretKey = process.env.KEY;
console.log('secretKey', secretKey);
const issuer = process.env.ISSUER;

const authenticateToken = async (req, res, next) => {
  const token = await req.header('Authorization');
  console.log('auth token---', token);

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }
  const decoded = jwt.verify(token, secretKey);
  console.log(decoded);
  // const user = users.find((u) => u.id === decoded.userId);
  await User.findOne({ id: decoded.userId }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
      next();
  })
  
  // jwt.verify(token, 'key', (err, user) => {
  //   if (err) {
  //     return res.status(401).json({ error: 'Invalid token' });
  //   }
  //   req.user = user;
  //   next();
  // });
};


const isAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }

  return res.status(403).json({success: false, message: 'Access denied.' });
};

module.exports = { authenticateToken, isAdmin };
