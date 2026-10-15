const express = require('express');
const router = express.Router();

const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// If you have authentication middleware (e.g. protect, authorize) you can import them here:
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getBlogs)
  .post(protect, authorize('super-admin', 'administrator', 'super admin', 'admin'), createBlog);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, authorize('super-admin', 'administrator', 'super admin', 'admin'), updateBlog)
  .delete(protect, authorize('super-admin', 'administrator', 'super admin', 'admin'), deleteBlog);

module.exports = router;
