const express = require('express');
const { 
    getChapters, 
    createChapter, 
    updateChapter, 
    deleteChapter 
} = require('../controllers/chapterController');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('instructor', 'admin'), createChapter);

router.get('/course/:courseId', getChapters);

router.route('/:id')
    .put(protect, authorize('instructor', 'admin'), updateChapter)
    .delete(protect, authorize('instructor', 'admin'), deleteChapter);

module.exports = router;
