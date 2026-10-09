const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: [true, 'Please add full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    program: {
        type: String,
        required: [true, 'Please specify the program']
    },
    documents: [String], // Array of URLs to uploaded documents
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Waitlisted'],
        default: 'Pending'
    },
    notes: String,
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Admission', admissionSchema);
