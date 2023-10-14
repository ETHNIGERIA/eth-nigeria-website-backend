const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const router = express.Router();

// onboard a new user
router.post('/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, password, city, state } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hashSync(password, 10);
  
      // Create a new user record
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        city,
        state,
      });
      if (!newUser) {
        return res.status(500).json({success: false, err: 'user registeration failed'});
      };

      const user = await newUser.save();
  
      return res.status(201).json({ user: user.lastName, status: 'Signup successfull' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal server error', error: error });
    }
});


// get all user
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select(['firstName', 'lastName','email', '-password', 'city', 'state']);
        if(!users){
            return res.status(404).send('no user found');
        }
        return res.status(200).send(users);
    } catch (e) {
        return res.status(500).json({success: false, message: 'internal server error', err: e});
    }
});

// get count of users
router.get('/total', authenticateToken, async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        if (!usersCount){
            return res.status(500).json({success: false, message: 'cannot get total count'});
        }
        return res.status(200).send({total_users: usersCount});
    } catch (e) {
        return res.status(500).json({success: false, err: e});
    }
});

//get user by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const ID = mongoose.isValidObjectId(req.params.id);
        if(!ID) {
            return res.status(400).json({ERR: 'invalid userID'});
        }
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).send('user not found');
        }
        return res.status(200).send(user);
    } catch (e) {
        return res.status(500).json({success: false, err: e});
    }
});

// update user profile
router.patch('/update/:id', authenticateToken, async (req, res) => {
    const id = mongoose.isValidObjectId(req.params.id);
    if(!id){
        return res.status(400).send('Invalid user id');
    }
    try {
        let user = await User.findByIdAndUpdate(
            req.params.id,
            {
                displayName: req.body.displayName,
                phone: req.body.phone,
                avatar: req.body.avatar,
                city: req.body.city,
                state: req.body.state,
                modifiedAt: new Date()
            },
            {new : true},
        ).select('-password');
        if(!user){
            return res.status(404).send('User not found');
        }
        return res.status(200).send(user);
    } catch (e) {
        return res.status(500).json({success: false, msg: 'internal server error', ERR: e});
    }

});

// remove a user
router.delete('/rm/:userId', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.remove();
  
      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error });
    }
});
  
// logout
router.get('/logout', authenticateToken, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/login');
    });
});
  
module.exports = router;