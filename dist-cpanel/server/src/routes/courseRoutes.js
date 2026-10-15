const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse, unenrollCourse, getCourseAnalytics, getMyProgress } = require('../controllers/courseController');
const { getProgress, updateProgress, getWeeklyStats } = require('../controllers/progressController');

// Include other resource routers
const lessonRouter = require('./lessonRoutes');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// Re-route into other resource routers
router.use('/:courseId/lessons', lessonRouter);

router.get('/my-progress', protect, getMyProgress);

router
    .route('/')
    .get(getCourses)
    .post(protect, authorize('instructor', 'admin'), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('instructor', 'admin'), updateCourse)
    .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.get('/:id/analytics', protect, authorize('instructor', 'admin'), getCourseAnalytics);

router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/unenroll', protect, unenrollCourse);

router.get('/stats/weekly', protect, getWeeklyStats);
router.get('/:courseId/progress', protect, getProgress);
router.post('/:courseId/lessons/:lessonId/complete', protect, updateProgress);

module.exports = router;
