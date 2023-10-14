const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv/config');

const key = process.env.KEY;


const generateJwtToken = async (user) => {
  const payload = {
    sub: user._id,
    email: user.email,
  };

  const token = await jwt.sign(payload, key, { expiresIn: '7d' });
  return token;
}

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Verify the password
    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    };

    const token = generateJwtToken(user);
    req.session.user = user;

    return res.status(200).json({ token: token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { login, generateJwtToken };