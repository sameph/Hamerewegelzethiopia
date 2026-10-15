const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false // Optional for group messages
    },
    group: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course', // Messages can be tied to a course/group
        required: false
    },
    content: {
        type: String,
        required: [true, 'Please add message content']
    },
    attachments: [{
        name: String,
        url: String,
        fileType: String
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
