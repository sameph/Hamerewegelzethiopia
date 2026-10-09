const express = require('express');
const {
    apply,
    getAdmissions,
    updateAdmissionStatus,
    getMyAdmission
} = require('../controllers/admissionController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', apply);
router.get('/my', getMyAdmission);

router.use(authorize('admin'));

router.get('/', getAdmissions);
router.put('/:id/status', updateAdmissionStatus);

module.exports = router;
