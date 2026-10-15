const express = require('express');
const router = express.Router();

const {
  getSermons,
  getSermon,
  createSermon,
  updateSermon,
  deleteSermon,
} = require('../controllers/sermonController');

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getSermons)
  .post(protect, authorize('super-admin', 'administrator', 'super admin', 'admin'), createSermon);

router
  .route('/:id')
  .get(getSermon)
  .put(protect, authorize('super-admin', 'administrator', 'super admin', 'admin'), updateSermon)
  .delete(protect, authorize('super-admin', 'administrator', 'super admin', 'admin'), deleteSermon);

module.exports = router;
