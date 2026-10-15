const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title'],
        trim: true,
    },
    author: {
        type: String,
    },
    description: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    pdfUrl: {
        type: String,
        required: [true, 'Please add a PDF URL'],
    },
    category: {
        type: String,
        default: 'General',
    },
    price: {
        type: Number,
        default: 0,
    },
    isFree: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Book', bookSchema);
