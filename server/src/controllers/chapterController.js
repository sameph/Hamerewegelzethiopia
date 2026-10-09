const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');

// @desc    Get all chapters for a course
// @route   GET /api/v1/chapters/course/:courseId
// @access  Public
exports.getChapters = async (req, res, next) => {
    try {
        let filter = { course: req.params.courseId };
        
        // If student, only show published
        if (req.user && (req.user.role === 'student' || !req.user.role)) {
            filter.status = 'published';
        }

        const chapters = await Chapter.find(filter).sort('order');
        res.status(200).json({ success: true, count: chapters.length, data: chapters });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new chapter
// @route   POST /api/v1/chapters
// @access  Private/Instructor
exports.createChapter = async (req, res, next) => {
    try {
        const chapter = await Chapter.create(req.body);
        res.status(201).json({ success: true, data: chapter });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update chapter
// @route   PUT /api/v1/chapters/:id
// @access  Private/Instructor
exports.updateChapter = async (req, res, next) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: chapter });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete chapter
// @route   DELETE /api/v1/chapters/:id
// @access  Private/Instructor
exports.deleteChapter = async (req, res, next) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
        
        await chapter.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
