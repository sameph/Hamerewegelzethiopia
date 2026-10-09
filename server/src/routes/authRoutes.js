const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword,
    getAdminStats,
    getStudentStats,
    getInstructorStats,
    getTeacherRecentActivity,
    inviteTeacher,
} = require('../controllers/authController');

const router = express.Router();

const { 
    protect,
    authorize
} = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.get('/student/stats', protect, authorize('student'), getStudentStats);
router.get('/instructor/stats', protect, authorize('instructor'), getInstructorStats);
router.get('/instructor/activity', protect, authorize('instructor'), getTeacherRecentActivity);
router.post('/admin/invite-teacher', protect, authorize('admin'), inviteTeacher);

module.exports = router;
