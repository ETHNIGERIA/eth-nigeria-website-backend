const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name require'],
    },
    lastName: {
        type: String,
        required: [true, 'first name require'],
    },
    displayName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        unique: [true, 'email already exist'],
        required: [true, 'email is required'],
        validate: {
            validator: function (email) {
                const isEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                return isEmail.test(email);
            },
            message: 'Invalid email address format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        unique: [true, 'phone number already exist'],
        required: [true, 'phone number is required'],
    },
    avatar: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
});

// // enable virtual to use _id as id in other apps connected to this schema
// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// userSchema.set('toJSON', {
//     virtuals: true, // enable virtual to frontend as json. display id
// });
userSchema.methods.verifyPassword = async (password) => {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;