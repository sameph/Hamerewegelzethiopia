const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @desc    Get all assignments for a course
// @route   GET /api/v1/assignments/course/:courseId
// @access  Public
exports.getAssignments = async (req, res, next) => {
    try {
        let filter = { course: req.params.courseId };
        
        // If student, only show published
        if (req.user && (req.user.role === 'student' || !req.user.role)) {
            filter.status = 'published';
        }

        const assignments = await Assignment.find(filter);
        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new assignment
// @route   POST /api/v1/assignments
// @access  Private/Instructor
exports.createAssignment = async (req, res, next) => {
    try {
        req.body.instructor = req.user.id;
        const assignment = await Assignment.create(req.body);
        res.status(201).json({ success: true, data: assignment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get submissions for an assignment
// @route   GET /api/v1/assignments/:id/submissions
// @access  Private/Instructor
exports.getSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'username email');
        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Grade a submission
// @route   PUT /api/v1/assignments/submissions/:id/grade
// @access  Private/Instructor
exports.gradeSubmission = async (req, res, next) => {
    try {
        const submission = await Submission.findByIdAndUpdate(req.params.id, {
            grade: req.body.grade,
            feedback: req.body.feedback,
            status: 'reviewed'
        }, { new: true });

        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Submit an assignment
// @route   POST /api/v1/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = async (req, res, next) => {
    try {
        req.body.assignment = req.params.id;
        req.body.student = req.user.id;

        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            assignment: req.params.id,
            student: req.user.id
        });

        if (existingSubmission) {
            return res.status(400).json({ success: false, message: 'You have already submitted this assignment' });
        }

        const submission = await Submission.create(req.body);
        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
// @desc    Get current user submissions
// @route   GET /api/v1/assignments/submissions
// @access  Private
exports.getMySubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ student: req.user.id }).populate('assignment', 'title dueDate');
        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get assignments for enrolled courses with submission status
// @route   GET /api/v1/assignments/my
// @access  Private/Student
exports.getMyAssignments = async (req, res, next) => {
    try {
        const courses = await Course.find({ enrolledStudents: req.user.id }).select('_id title');
        const courseIds = courses.map(c => c._id);

        const assignments = await Assignment.find({ course: { $in: courseIds }, status: 'published' })
            .populate('course', 'title');

        const submissions = await Submission.find({ student: req.user.id });

        const assignmentsWithStatus = assignments.map(assignment => {
            const submission = submissions.find(s => s.assignment.toString() === assignment._id.toString());
            return {
                ...assignment.toObject(),
                submissionStatus: submission ? submission.status : 'pending',
                submission: submission || null
            };
        });

        res.status(200).json({ success: true, count: assignmentsWithStatus.length, data: assignmentsWithStatus });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
