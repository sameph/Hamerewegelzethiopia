const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

// @desc    Get progress for a course
// @route   GET /api/v1/courses/:courseId/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
    try {
        let progress = await Progress.findOne({
            user: req.user.id,
            course: req.params.courseId
        });

        if (!progress) {
            // Create initial progress record if it doesn't exist
            progress = await Progress.create({
                user: req.user.id,
                course: req.params.courseId,
                completedLessons: []
            });
        }

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (err) {
        console.error('Get Progress Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Mark lesson as completed
// @route   POST /api/v1/courses/:courseId/lessons/:lessonId/complete
// @access  Private
exports.updateProgress = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;

        let progress = await Progress.findOne({
            user: req.user.id,
            course: courseId
        });

        if (!progress) {
            progress = new Progress({
                user: req.user.id,
                course: courseId,
                completedLessons: [],
                completionHistory: []
            });
        }

        // Add lesson to completed if not already there
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            progress.completionHistory.push({
                lesson: lessonId,
                completedAt: Date.now()
            });
        }

        progress.lastLesson = lessonId;
        progress.updatedAt = Date.now();

        await progress.save();

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (err) {
        console.error('Update Progress Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get weekly learning stats for student
// @route   GET /api/v1/courses/stats/weekly
// @access  Private
exports.getWeeklyStats = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const progressRecords = await Progress.find({
            user: req.user.id,
            'completionHistory.completedAt': { $gte: sevenDaysAgo }
        }).populate({
            path: 'completionHistory.lesson',
            populate: { path: 'chapter', select: 'duration' }
        });

        const weeklyDurations = Array(7).fill(0);
        const today = new Date();
        today.setHours(0,0,0,0);

        for (const record of progressRecords) {
            for (const item of record.completionHistory) {
                if (item.completedAt >= sevenDaysAgo && item.lesson && item.lesson.chapter) {
                    const compDate = new Date(item.completedAt);
                    compDate.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((today - compDate) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays >= 0 && diffDays < 7) {
                        // Estimate lesson duration: chapter duration / estimated lessons (assume 5 if unknown)
                        const lessonDuration = (item.lesson.chapter.duration || 60) / 5; 
                        weeklyDurations[6 - diffDays] += lessonDuration;
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            data: {
                labels: ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'],
                durations: weeklyDurations,
                totalThisWeek: weeklyDurations.reduce((a, b) => a + b, 0)
            }
        });
    } catch (err) {
        console.error('Get Weekly Stats Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};
