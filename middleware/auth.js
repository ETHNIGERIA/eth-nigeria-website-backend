const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const token = await req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};


const isAdmin = (req, res, next) => {
  // Check if the user is an admin
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }

  return res.status(403).json({success: false, message: 'Access denied.' });
}

module.exports = { authenticateToken, isAdmin };
