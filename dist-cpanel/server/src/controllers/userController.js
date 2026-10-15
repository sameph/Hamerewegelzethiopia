const User = require("../models/User");
const mongoose = require("mongoose");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get students enrolled in instructor's courses
// @route   GET /api/v1/users/my-students
// @access  Private/Instructor
exports.getMyStudents = async (req, res, next) => {
  try {
    const Course = mongoose.model("Course");
    const courses = await Course.find({ instructor: req.user.id });

    // Extract all unique enrolled student IDs
    const studentIds = new Set();
    courses.forEach((course) => {
      // If courseId filter is provided, only process that course
      if (req.query.courseId && course._id.toString() !== req.query.courseId) {
        return;
      }
      course.enrolledStudents?.forEach((id) => {
        studentIds.add(id.toString());
      });
    });

    const students = await User.find({
      _id: { $in: Array.from(studentIds) },
    }).select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get instructors of courses the student is enrolled in
// @route   GET /api/v1/users/my-instructors
// @access  Private/Student
exports.getMyInstructors = async (req, res, next) => {
  try {
    const Course = mongoose.model("Course");
    // Find courses where student is enrolled
    const courses = await Course.find({
      enrolledStudents: req.user.id,
    }).populate("instructor", "username email profileImage department program");

    // Extract unique instructors
    const instructorsMap = new Map();
    courses.forEach((course) => {
      if (course.instructor) {
        const instructor = course.instructor;
        instructorsMap.set(instructor._id.toString(), instructor);
      }
    });

    const instructors = Array.from(instructorsMap.values());

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/users/profile/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/v1/users/profile/me
// @access  Private
exports.updateMyProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      phone: req.body.phone,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      program: req.body.program,
      department: req.body.department,
      batch: req.body.batch,
      currentSemester: req.body.currentSemester,
      profileImage: req.body.profileImage,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Change user password
// @route   PUT /api/v1/users/password/change
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide current password, new password, and confirmation",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get user with password field selected
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Reset password (forgot password)
// @route   POST /api/v1/users/password/reset
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, new password, and confirmation",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
