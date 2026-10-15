const express = require('express');
const { createEnrollmentSession, createDonationSession, handleWebhook } = require('../controllers/stripeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe webhook needs raw body, so we define it first
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Subsequent routes need JSON body parser
router.use(express.json());

router.post('/enroll/:courseId', protect, createEnrollmentSession);
router.post('/donate', createDonationSession); // Making donation public, though controller handles optional auth

module.exports = router;
