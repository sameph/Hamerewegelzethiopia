const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentType: {
        type: String,
        enum: ['enrollment', 'donation'],
        required: true
    },
    provider: {
        type: String,
        enum: ['stripe', 'chapa'],
        required: true,
        default: 'stripe'
    },
    tx_ref: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
