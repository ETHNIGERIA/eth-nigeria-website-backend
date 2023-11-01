const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const key = process.env.KEY;
const issuer = process.env.ISSUER;
console.log('issuer :' , issuer);


const generateJwtToken = (user) => {
  // const payload = {
  //   sub: user.id,
  //   email: user.email,
  // };

  // const token =  jwt.sign(payload, 'key', {expiresIn: '7d' });
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    key,
    {
      algorithm: 'HS256',
      issuer: issuer,
      expiresIn: '1h', // Token expiration time (1 hour)
    }
  );
  return token;
};

const verifyPassword = (password, hashedPassword) => {
  const isValid = bcrypt.compareSync(password, hashedPassword);
  return isValid;
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }
    
    // Verify the password
    const isPasswordValid = verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    };
    console.log('generating token')
    const token = generateJwtToken(user);
    console.log('generated token :', token);
    req.session.user = user;

    return res.status(200).json({ token: token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const setRole = async (email, role) => {
  try {
    const userId = await userById(email); // get user by id and pass the id to update
    console.log('userId', userId);
    const newRole = role;
    const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    if (!user){
      return ({success: false, message: 'User not found'});
    }
    return ({success: true, message: 'role added successfully'});
  } catch (e) {
    return ({success: false, error: e});
  }
}

const userById = async (email) => {
  const userId = await User.findOne({email});
  if (!userId){
    return false
  }
  return userId.id;
}


module.exports = { login, generateJwtToken, setRole };