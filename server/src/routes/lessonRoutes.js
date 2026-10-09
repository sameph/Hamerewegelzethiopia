const express = require("express");
const {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  addLessonMaterial,
  removeLessonMaterial,
} = require("../controllers/lessonController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getLessons)
  .post(protect, authorize("instructor", "admin"), createLesson);

router
  .route("/:id")
  .get(protect, getLessonById)
  .put(protect, authorize("instructor", "admin"), updateLesson)
  .delete(protect, authorize("instructor", "admin"), deleteLesson);

// Material/Resource routes
router.post(
  "/:id/materials",
  protect,
  authorize("instructor", "admin"),
  addLessonMaterial
);
router.delete(
  "/:id/materials/:materialId",
  protect,
  authorize("instructor", "admin"),
  removeLessonMaterial
);

module.exports = router;
