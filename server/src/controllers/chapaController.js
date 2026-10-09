const axios = require('axios');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Donation = require('../models/Donation');
const User = require('../models/User');
const crypto = require('crypto');

const CHAPA_URL = 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_VERIFY_URL = 'https://api.chapa.co/v1/transaction/verify/';

// @desc    Initialize Chapa transaction for course enrollment
// @route   POST /api/v1/chapa/enroll/:courseId
// @access  Private
exports.initializeChapaEnrollment = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if student already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        // Chapa tx_ref: max 50 chars. customization.title: max 16 chars.
        // Use shorter tx_ref
        const tx_ref = `en-${Date.now().toString(36)}-${courseId.toString().slice(-5)}-${req.user.id.toString().slice(-5)}`;

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3500';

        // Ensure amount is valid
        const amount = Number(course.price);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid course price' });
        }

        // Strict sanitization for Chapa title: letters, numbers, hyphens, underscores, spaces, dots
        const cleanTitle = `Enroll ${course.title}`.replace(/[^a-zA-Z0-9\-_. ]/g, '').substring(0, 16);

        const payload = {
            amount: amount.toString(),
            currency: 'ETB',
            email: req.user.email,
            first_name: req.user.username.replace(/[^a-zA-Z ]/g, '').split(' ')[0] || 'Student',
            last_name: req.user.username.replace(/[^a-zA-Z ]/g, '').split(' ')[1] || 'LMS',
            tx_ref,
            callback_url: `${backendUrl}/api/v1/chapa/webhook`,
            return_url: `${frontendUrl}/lms/dashboard/student/courses/${courseId}?success=true`,
            customization: {
                title: cleanTitle,
                description: `Payment for ${course.title}`.substring(0, 100)
            },
            meta: {
                userId: req.user.id,
                courseId: courseId,
                paymentType: 'enrollment'
            }
        };

        console.log('Chapa Enrollment Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(CHAPA_URL, payload, {
            headers: {
                Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.status !== 'success') {
            return res.status(400).json({ success: false, message: 'Chapa initialization failed' });
        }

        // Create a pending payment record
        await Payment.create({
            user: req.user.id,
            course: course._id,
            amount: course.price,
            currency: 'ETB',
            tx_ref,
            paymentType: 'enrollment',
            provider: 'chapa',
            status: 'pending'
        });

        res.status(200).json({ success: true, url: response.data.data.checkout_url });
    } catch (err) {
        console.error('Chapa Error:', err.response?.data || err.message);
        res.status(400).json({ success: false, message: err.response?.data?.message || err.message });
    }
};

// @desc    Initialize Chapa transaction for donation
// @route   POST /api/v1/chapa/donate
// @access  Public/Private
exports.initializeChapaDonation = async (req, res, next) => {
    try {
        const { amount, message, email, first_name, last_name } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide a valid donation amount' });
        }

        const tx_ref = `dn-${Date.now().toString(36)}-${req.user ? req.user.id.toString().slice(-5) : 'anon'}`;
        
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3500';

        // Ensure amount is valid
        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid donation amount' });
        }

        const payload = {
            amount: amountNum.toString(),
            currency: 'ETB',
            email: email || (req.user ? req.user.email : 'anonymous@hamerewegel.org'),
            first_name: (first_name || (req.user ? req.user.username.split(' ')[0] : 'Donor')).replace(/[^a-zA-Z ]/g, ''),
            last_name: (last_name || (req.user ? req.user.username.split(' ')[1] : 'Friend')).replace(/[^a-zA-Z ]/g, ''),
            tx_ref,
            callback_url: `${backendUrl}/api/v1/chapa/webhook`,
            return_url: `${frontendUrl}/donation/success`,
            customization: {
                title: 'Donation'.substring(0, 16),
                description: (message || 'General Donation').substring(0, 100)
            },
            meta: {
                userId: req.user ? req.user.id : 'anonymous',
                paymentType: 'donation',
                message: message || ''
            }
        };

        console.log('Chapa Donation Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(CHAPA_URL, payload, {
            headers: {
                Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.status !== 'success') {
            return res.status(400).json({ success: false, message: 'Chapa initialization failed' });
        }

        // Create a pending payment record
        await Payment.create({
            user: req.user ? req.user.id : null,
            amount: amount,
            currency: 'ETB',
            tx_ref,
            paymentType: 'donation',
            provider: 'chapa',
            status: 'pending'
        });

        res.status(200).json({ success: true, url: response.data.data.checkout_url });
    } catch (err) {
        console.error('Chapa Error:', err.response?.data || err.message);
        res.status(400).json({ success: false, message: err.response?.data?.message || err.message });
    }
};

// @desc    Verify Chapa transaction
// @route   GET /api/v1/chapa/verify/:tx_ref
// @access  Public
exports.verifyChapaTransaction = async (req, res) => {
    try {
        const response = await axios.get(`${CHAPA_VERIFY_URL}${req.params.tx_ref}`, {
            headers: {
                Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
            }
        });

        if (response.data.status === 'success' && response.data.data.status === 'success') {
            // Process the successful transaction if not already processed
            await processSuccessfulTransaction(response.data.data);
            return res.status(200).json({ success: true, data: response.data.data });
        }

        res.status(400).json({ success: false, message: 'Transaction not successful' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Handle Chapa Webhook
// @route   POST /api/v1/chapa/webhook
// @access  Public
exports.handleChapaWebhook = async (req, res) => {
    // Validate Chapa Signature
    const hash = crypto.createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-chapa-signature']) {
        return res.status(401).send('Invalid signature');
    }

    const { tx_ref, status } = req.body;

    if (status === 'success') {
        try {
            await processSuccessfulTransaction(req.body);
        } catch (err) {
            console.error('Webhook processing error:', err);
            return res.status(500).send('Error processing webhook');
        }
    }

    res.status(200).send('OK');
};

// Helper function to process successful transactions
async function processSuccessfulTransaction(data) {
    const { tx_ref, meta } = data;
    
    const payment = await Payment.findOne({ tx_ref });
    if (!payment || payment.status === 'completed') return;

    payment.status = 'completed';
    await payment.save();

    if (payment.paymentType === 'enrollment') {
        const { userId, courseId } = meta;
        const course = await Course.findById(courseId);
        
        if (course && !course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();

            // Notify student (Chat logic)
            const Message = require('../models/Message');
            const instructor = await User.findById(course.instructor);
            const student = await User.findById(userId);

            await Message.create({
                sender: course.instructor,
                recipient: userId,
                content: `Welcome to ${course.title}! Your Chapa payment was successful. I am your instructor, ${instructor?.username || 'Teacher'}.`
            });

            await Message.create({
                sender: course.instructor,
                group: course._id,
                content: `${student?.username || 'A new student'} has joined the curriculum via Chapa. Welcome!`
            });
        }
    } else if (payment.paymentType === 'donation') {
        const { userId, message } = meta;
        await Donation.create({
            user: userId === 'anonymous' ? null : userId,
            amount: data.amount,
            currency: data.currency,
            message: message || 'Donation via Chapa',
            tx_ref,
            status: 'completed'
        });
    }
}
