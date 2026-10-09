let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('WARNING: STRIPE_SECRET_KEY is not defined in .env. Stripe integration will not work.');
}
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Create Stripe Checkout session for course enrollment
// @route   POST /api/v1/stripe/enroll/:courseId
// @access  Private
exports.createEnrollmentSession = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(500).json({ success: false, message: 'Stripe is not configured on this server' });
        }
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if student already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: course.currency || 'usd',
                    product_data: {
                        name: course.title,
                        description: course.description.substring(0, 500),
                    },
                    unit_amount: Math.round(course.price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/lms/dashboard/student/courses/${course._id}?success=true`,
            cancel_url: `${req.headers.origin}/lms/dashboard/student/courses/${course._id}?canceled=true`,
            customer_email: req.user.email,
            client_reference_id: req.params.courseId,
            metadata: {
                userId: req.user.id,
                courseId: req.params.courseId,
                paymentType: 'enrollment'
            }
        });

        // Create a pending payment record
        await Payment.create({
            user: req.user.id,
            course: course._id,
            amount: course.price,
            currency: course.currency || 'usd',
            stripeSessionId: session.id,
            paymentType: 'enrollment',
            status: 'pending'
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create Stripe Checkout session for donation
// @route   POST /api/v1/stripe/donate
// @access  Public/Private
exports.createDonationSession = async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(500).json({ success: false, message: 'Stripe is not configured on this server' });
        }
        const { amount, message, currency = 'usd' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide a valid donation amount' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Donation to Hamere Wegel',
                        description: 'Support our mission',
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/donation/cancel`,
            customer_email: req.user ? req.user.email : undefined,
            metadata: {
                userId: req.user ? req.user.id : 'anonymous',
                message: message || '',
                paymentType: 'donation'
            }
        });

        // Create a pending payment record
        await Payment.create({
            user: req.user ? req.user.id : null, // Might be null for anonymous, but our schema requires user. 
            // Update: I'll make user optional in model or use a system user for anonymous.
            // For now, assume authenticated or just don't create Payment record if anonymous.
            amount: amount,
            currency: currency,
            stripeSessionId: session.id,
            paymentType: 'donation',
            status: 'pending'
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Handle Stripe Webhooks
// @route   POST /api/v1/stripe/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
    if (!stripe) {
        return res.status(500).json({ success: false, message: 'Stripe is not configured' });
    }
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            // Update Payment record
            const payment = await Payment.findOneAndUpdate(
                { stripeSessionId: session.id },
                { status: 'completed' },
                { new: true }
            );

            const { userId, courseId, paymentType, message } = session.metadata;

            if (paymentType === 'enrollment') {
                // Enroll student in course
                const course = await Course.findById(courseId);
                if (course && !course.enrolledStudents.includes(userId)) {
                    course.enrolledStudents.push(userId);
                    await course.save();

                    // Automatic chat messages (copied from courseController.js)
                    const Message = require('../models/Message');
                    const instructor = await User.findById(course.instructor);
                    const student = await User.findById(userId);

                    await Message.create({
                        sender: course.instructor,
                        recipient: userId,
                        content: `Welcome to ${course.title}! Your payment was successful. I am your instructor, ${instructor?.username || 'Teacher'}.`
                    });

                    await Message.create({
                        sender: course.instructor,
                        group: course._id,
                        content: `${student?.username || 'A new student'} has joined the curriculum. Welcome!`
                    });
                }
            } else if (paymentType === 'donation') {
                // Record donation
                await Donation.create({
                    user: userId === 'anonymous' ? null : userId,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    message: message,
                    stripeSessionId: session.id,
                    status: 'completed'
                });
            }
        } catch (err) {
            console.error('Webhook processing error:', err);
            return res.status(500).json({ message: 'Internal server error processing webhook' });
        }
    }

    res.json({ received: true });
};
