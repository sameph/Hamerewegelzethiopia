const Lesson = require("../models/Lesson");

// Helper to extract YouTube Video ID
const extractYoutubeId = (url) => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// @desc    Get all lessons for a course
// @route   GET /api/v1/courses/:courseId/lessons
// @access  Public
exports.getLessons = async (req, res, next) => {
  try {
    let filter = { course: req.params.courseId };

    // If student, only show published
    if (req.user && (req.user.role === "student" || !req.user.role)) {
      filter.status = "published";
    }

    const lessons = await Lesson.find(filter).sort("order");
    res
      .status(200)
      .json({ success: true, count: lessons.length, data: lessons });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new lesson
// @route   POST /api/v1/courses/:courseId/lessons
// @access  Private (Instructor/Admin)
exports.createLesson = async (req, res, next) => {
  try {
    req.body.course = req.params.courseId;

    // Extract YouTube ID if URL provided
    if (req.body.videoUrl) {
      const videoId = extractYoutubeId(req.body.videoUrl);
      if (!videoId && req.body.type === "video") {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid YouTube video URL.",
        });
      }
      req.body.videoId = videoId;
    }

    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/v1/lessons/:id
// @access  Private (Instructor/Admin)
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    // Extract YouTube ID if URL updated
    if (req.body.videoUrl) {
      const videoId = extractYoutubeId(req.body.videoUrl);
      if (!videoId && (req.body.type === "video" || lesson.type === "video")) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid YouTube video URL.",
        });
      }
      req.body.videoId = videoId;
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/v1/lessons/:id
// @access  Private (Instructor/Admin)
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    await lesson.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single lesson
// @route   GET /api/v1/lessons/:id
// @access  Private
exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("course")
      .populate("chapter");
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }
    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Add material/resource to lesson
// @route   POST /api/v1/lessons/:id/materials
// @access  Private (Instructor/Admin)
exports.addLessonMaterial = async (req, res, next) => {
  try {
    const { name, url, fileType } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: "Please provide material name and URL",
      });
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    const material = { name, url, fileType: fileType || "pdf" };
    lesson.materials.push(material);
    await lesson.save();

    res.status(200).json({
      success: true,
      data: lesson,
      message: "Material added successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Remove material/resource from lesson
// @route   DELETE /api/v1/lessons/:id/materials/:materialId
// @access  Private (Instructor/Admin)
exports.removeLessonMaterial = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    lesson.materials = lesson.materials.filter(
      (m) => m._id.toString() !== req.params.materialId
    );
    await lesson.save();

    res.status(200).json({
      success: true,
      data: lesson,
      message: "Material removed successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
