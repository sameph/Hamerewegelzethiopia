const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    outcomes: [String],
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    duration: String,
    thumbnail: String,
    enrolledStudents: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    isRecentCourse: {
        type: Boolean,
        default: false,
    },
    isPopular: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        required: [true, 'Please add a course price'],
    },
    currency: {
        type: String,
        default: 'USD',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', courseSchema);
