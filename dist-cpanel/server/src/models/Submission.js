const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
    },
    fileUrl: {
        type: String,
    },
    grade: {
        type: String,
    },
    feedback: {
        type: String,
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewed', 'pending'],
        default: 'submitted',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Submission', submissionSchema);
