const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'ONGOING', 'ENDED'],
        default: 'UPCOMING',
    },
    modifiedAt: {
        type: Date,
    },
});

exports.Event = mongoose.model('Event', eventSchema);

