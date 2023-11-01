const {Event} = require('../models/Event');
const express = require('express');
const {authenticateToken, isAdmin } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// create new event
router.post('/add', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, description, location, status } = req.body;

        const newEvent = new Event({
            title,
            description,
            location,
            status
        });
        if(!newEvent) {
            return res.status(500).json({success: false, err: 'Event creation failed'});
        }
        const event = await newEvent.save();
  
      return res.status(201).json({ event: event, message: 'Event creation successfull'});
    } catch (e) {
        return res.status(500).json({success: false, error: e});
    }
});

// get all events
router.get('/events', authenticateToken, async (req, res) => {
    try {
        const events = await Event.find().select(['title', 'description','location', 'status']);
        if(!events){
            return res.status(404).send('no events found');
        }
        return res.status(200).send(events);
    } catch (e) {
        return res.status(500).json({success: false, message: 'internal server error', err: e});
    }
});

// get event by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const ID = mongoose.isValidObjectId(req.params.id);
        if(!ID) {
            return res.status(400).json({err: 'invalid userID'});
        }
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).send('event not found');
        }
        return res.status(200).send(event);
    } catch (e) {
        return res.status(500).json({success: false, err: e});
    }
});

// update event
router.patch('/update/:id', authenticateToken, isAdmin, async (req, res) => {
    const id = mongoose.isValidObjectId(req.params.id);
    if(!id){
        return res.status(400).send('Invalid event id');
    }
    try {
        let event = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                location: req.body.location,
                status: req.body.status,
                modifiedAt: new Date()
            },
            {new : true},
        );
        if(!event){
            return res.status(404).send('event not found');
        }
        return res.status(200).send(event);
    } catch (e) {
        return res.status(500).json({success: false, msg: 'internal server error', error: e});
    }
});

// delete an event
router.delete('/rm/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const eventID = mongoose.isValidObjectId(req.params.id);
        if(!eventID) {
            return res.status(400).send('Invalid event id');
        }
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ error: 'event not found' });
        }
        await event.remove();
  
        return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error });
    }
});

module.exports = router;