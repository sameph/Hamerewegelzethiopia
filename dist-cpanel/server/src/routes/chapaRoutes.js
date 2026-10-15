const express = require('express');
const { 
    initializeChapaEnrollment, 
    initializeChapaDonation, 
    verifyChapaTransaction, 
    handleChapaWebhook 
} = require('../controllers/chapaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/enroll/:courseId', protect, initializeChapaEnrollment);
router.post('/donate', initializeChapaDonation);
router.get('/verify/:tx_ref', verifyChapaTransaction);
router.post('/webhook', handleChapaWebhook);

module.exports = router;
