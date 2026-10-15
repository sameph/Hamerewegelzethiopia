const Admission = require('../models/Admission');
const User = require('../models/User');

// @desc    Submit an admission application
// @route   POST /api/v1/admissions
// @access  Private
exports.apply = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        
        // Check if user already has an active application
        const existingApplication = await Admission.findOne({ user: req.user.id, status: 'Pending' });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You already have a pending application' });
        }

        const admission = await Admission.create(req.body);
        res.status(201).json({ success: true, data: admission });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all admission applications
// @route   GET /api/v1/admissions
// @access  Private/Admin
exports.getAdmissions = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        query = Admission.find(reqQuery).populate('user', 'username email profileImage');

        // Search logic
        if (req.query.search) {
            const search = req.query.search;
            query = query.find({
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            });
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-appliedAt');
        }

        const admissions = await query;
        res.status(200).json({ success: true, count: admissions.length, data: admissions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update admission status
// @route   PUT /api/v1/admissions/:id/status
// @access  Private/Admin
exports.updateAdmissionStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        
        let admission = await Admission.findById(req.params.id);
        if (!admission) {
            return res.status(404).json({ success: false, message: 'Admission not found' });
        }

        admission.status = status;
        if (notes) admission.notes = notes;
        await admission.save();

        res.status(200).json({ success: true, data: admission });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get my admission application
// @route   GET /api/v1/admissions/my
// @access  Private
exports.getMyAdmission = async (req, res, next) => {
    try {
        const admission = await Admission.findOne({ user: req.user.id });
        res.status(200).json({ success: true, data: admission });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
