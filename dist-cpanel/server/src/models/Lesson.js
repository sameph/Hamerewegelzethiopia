const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a lesson title'],
        trim: true,
    },
    content: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    videoId: {
        type: String,
    },
    type: {
        type: String,
        enum: ['video', 'document', 'reading', 'material'],
        default: 'video',
    },
    materials: [{
        name: String,
        url: String,
        fileType: String // pdf, ppt, etc
    }],
    duration: String,
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    chapter: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chapter',
    },
    order: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Lesson', lessonSchema);
