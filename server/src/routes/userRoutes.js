const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMyStudents,
  getMyInstructors,
  getMyProfile,
  updateMyProfile,
  changePassword,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/password/reset", resetPassword);

// Protected routes
router.use(protect);

// Profile routes
router.route("/profile/me").get(getMyProfile).put(updateMyProfile);

// Password routes
router.put("/password/change", changePassword);

// Student/Instructor specific
router.get("/my-students", authorize("instructor", "admin"), getMyStudents);
router.get("/my-instructors", authorize("student", "admin"), getMyInstructors);

// Admin routes
router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUser);

router
  .route("/:id")
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

module.exports = router;
