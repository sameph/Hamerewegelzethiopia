const express = require('express');
const { 
    getAssignments, 
    createAssignment, 
    getSubmissions,
    gradeSubmission,
    submitAssignment,
    getMySubmissions,
    getMyAssignments
} = require('../controllers/assignmentController');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('instructor', 'admin'), createAssignment);

router.get('/submissions', protect, getMySubmissions);

router.get('/my', protect, authorize('student'), getMyAssignments);

router.get('/course/:courseId', getAssignments);

router.get('/:id/submissions', protect, authorize('instructor', 'admin'), getSubmissions);

router.put('/submissions/:id/grade', protect, authorize('instructor', 'admin'), gradeSubmission);

router.post('/:id/submit', protect, authorize('student'), submitAssignment);

module.exports = router;
