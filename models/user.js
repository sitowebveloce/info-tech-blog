const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String,
        // unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Add a valid email.'
        ]
    },
    username: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    resetPswToken: String,
    resetPswExp: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);