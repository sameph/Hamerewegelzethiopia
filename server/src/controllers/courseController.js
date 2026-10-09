const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Finding resource
        query = Course.find(JSON.parse(queryStr)).populate('instructor', 'username email');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Executing query
        const courses = await query;

        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'username email');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Fetch lessons, chapters, and assignments for this course
        const Lesson = require('../models/Lesson');
        const Chapter = require('../models/Chapter');
        const Assignment = require('../models/Assignment');

        // If user is student, only show published content
        let filter = { course: req.params.id };
        if (req.user && (req.user.role === 'student' || !req.user.role)) {
            filter.status = 'published';
        }

        const [lessons, chapters, assignments] = await Promise.all([
            Lesson.find(filter).sort('order'),
            Chapter.find(filter).sort('order'),
            Assignment.find(filter).sort('dueDate')
        ]);

        res.status(200).json({ success: true, data: { ...course._doc, lessons, chapters, assignments } });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new course
// @route   POST /api/v1/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
    try {
        // If user is not admin, force instructor to be the user
        if (req.user.role !== 'admin' && req.user.role !== 'super admin' && req.user.role !== 'administrator') {
            req.body.instructor = req.user.id;
        } else if (!req.body.instructor) {
            // If admin but no instructor provided, default to self (though admins usually assign)
            req.body.instructor = req.user.id;
        }

        if (!req.body.price && req.body.price !== 0) {
            return res.status(400).json({ success: false, message: 'Please provide a course price' });
        }

        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course owner or admin
        if (course.instructor.toString() !== req.user.id && (req.user.role !== 'admin' && req.user.role !== 'super admin' && req.user.role !== 'administrator')) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this course' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Make sure user is course owner or admin
        if (course.instructor.toString() !== req.user.id && (req.user.role !== 'admin' && req.user.role !== 'super admin' && req.user.role !== 'administrator')) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Enroll in a course
// @route   POST /api/v1/courses/:id/enroll
// @access  Private (Student)
exports.enrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if student already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        // Add student to course
        course.enrolledStudents.push(req.user.id);
        await course.save();

        // AUTOMATION: Create automated chat channels
        const Message = require('../models/Message');
        const User = require('../models/User');
        
        try {
            const student = await User.findById(req.user.id);
            const instructor = await User.findById(course.instructor);

            // 1. Private Welcome Message from Instructor
            await Message.create({
                sender: course.instructor,
                recipient: req.user.id,
                content: `Welcome to ${course.title}! I am your instructor, ${instructor?.username || 'Teacher'}. Feel free to ask me any questions here.`
            });

            // 2. Group Chat "System" Announcement
            await Message.create({
                sender: course.instructor, // System messages can be from instructor or a system user
                group: course._id,
                content: `${student?.username || 'A new student'} has joined the curriculum. Welcome to the fellow learners group!`
            });
        } catch (autoErr) {
            console.error('Enrollment Automation Error:', autoErr);
            // Don't fail the enrollment if chat automation fails
        }

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get course analytics
// @route   GET /api/v1/courses/:id/analytics
// @access  Private (Instructor/Admin)
exports.getCourseAnalytics = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Only instructor or admin
        if (course.instructor.toString() !== req.user.id && (req.user.role !== 'admin' && req.user.role !== 'super admin' && req.user.role !== 'administrator')) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const Progress = require('../models/Progress');
        const Submission = require('../models/Submission');
        const Lesson = require('../models/Lesson');

        const totalLessons = await Lesson.countDocuments({ course: req.params.id, status: 'published' });
        const progresses = await Progress.find({ course: req.params.id }).populate('user', 'username email');
        const submissions = await Submission.find({ course: req.params.id });

        const analytics = {
            totalEnrolled: course.enrolledStudents.length,
            averageProgress: progresses.length > 0 
                ? progresses.reduce((acc, curr) => acc + curr.percentComplete, 0) / progresses.length 
                : 0,
            completionRate: progresses.length > 0
                ? (progresses.filter(p => p.percentComplete === 100).length / progresses.length) * 100
                : 0,
            studentProgress: progresses.map(p => ({
                student: p.user,
                percentComplete: p.percentComplete,
                completedCount: p.completedLessons.length,
                totalLessons
            })),
            submissionStats: {
                totalSubmissions: submissions.length,
                gradedCount: submissions.filter(s => s.status === 'reviewed').length
            }
        };

        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Unenroll from a course
// @route   POST /api/v1/courses/:id/unenroll
// @access  Private (Student)
exports.unenrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if student is enrolled
        const studentIndex = course.enrolledStudents.indexOf(req.user.id);
        if (studentIndex === -1) {
            return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
        }

        // Remove student from course
        course.enrolledStudents.splice(studentIndex, 1);
        await course.save();

        // Delete student's progress for this course
        const Progress = require('../models/Progress');
        await Progress.findOneAndDelete({ user: req.user.id, course: req.params.id });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get user progress for all enrolled courses
// @route   GET /api/v1/courses/my-progress
// @access  Private (Student)
exports.getMyProgress = async (req, res, next) => {
    try {
        const Progress = require('../models/Progress');
        const progresses = await Progress.find({ user: req.user.id }).populate('course', 'title category description thumbnail');
        
        res.status(200).json({ success: true, count: progresses.length, data: progresses });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
