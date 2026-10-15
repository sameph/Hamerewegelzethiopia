const express = require('express');
const {
  getBooks,
  getBook,
  getBookBySlug,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getBooks).post(protect, authorize('admin', 'super admin', 'administrator'), createBook);
router.route('/slug/:slug').get(getBookBySlug);
router.route('/:id')
  .get(getBook)
  .put(protect, authorize('admin', 'super admin', 'administrator'), updateBook)
  .delete(protect, authorize('admin', 'super admin', 'administrator'), deleteBook);

module.exports = router;
