const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson'
    }],
    completionHistory: [{
        lesson: { type: mongoose.Schema.ObjectId, ref: 'Lesson' },
        completedAt: { type: Date, default: Date.now }
    }],
    lastLesson: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson'
    },
    percentComplete: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate percentage before saving
ProgressSchema.pre('save', async function() {
    if (this.isModified('completedLessons')) {
        const Lesson = mongoose.model('Lesson');
        const totalLessons = await Lesson.countDocuments({ course: this.course, status: 'published' });
        this.percentComplete = totalLessons > 0 
            ? Math.round((this.completedLessons.length / totalLessons) * 100)
            : 0;
    }
});

module.exports = mongoose.model('Progress', ProgressSchema);
