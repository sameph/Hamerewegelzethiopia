const LiveEvent = require("../models/LiveEvent");
const Course = require("../models/Course");

// @desc    Create a live event
// @route   POST /api/v1/live-events
// @access  Private (Admin/Instructor)
exports.createLiveEvent = async (req, res) => {
  try {
    req.body.instructor = req.user.id;
    const liveEvent = await LiveEvent.create(req.body);
    res.status(201).json({
      success: true,
      data: liveEvent,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all live events
// @route   GET /api/v1/live-events
// @access  Private
exports.getLiveEvents = async (req, res) => {
  try {
    let query;
    const isStudent = req.user.role === "student";

    if (req.user.role === "admin") {
      query = LiveEvent.find()
        .populate("instructor", "username role")
        .populate("course", "title");
    } else if (req.user.role === "instructor") {
      query = LiveEvent.find({ instructor: req.user.id })
        .populate("instructor", "username role")
        .populate("course", "title");
    } else {
      // Students: see only admin-created events
      const enrolledCourses = await Course.find({
        enrolledStudents: req.user.id,
      }).select("_id");
      const courseIds = enrolledCourses.map((c) => c._id);
      query = LiveEvent.find({
        $or: [{ course: { $in: courseIds } }, { course: { $exists: false } }],
      })
        .populate("instructor", "username role")
        .populate("course", "title");
    }

    const events = await query;
    const filteredEvents = isStudent
      ? events.filter((event) => event.instructor?.role === "admin")
      : events;

    res.status(200).json({
      success: true,
      count: filteredEvents.length,
      data: filteredEvents,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get today's live events
// @route   GET /api/v1/live-events/today
// @access  Private
exports.getTodayLiveEvents = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let filter = {
      startTime: { $gte: start, $lte: end },
    };

    if (req.user.role === "instructor") {
      filter.instructor = req.user.id;
    } else if (req.user.role === "student") {
      const enrolledCourses = await Course.find({
        enrolledStudents: req.user.id,
      }).select("_id");
      const courseIds = enrolledCourses.map((c) => c._id);
      filter.$or = [
        { course: { $in: courseIds } },
        { course: { $exists: false } },
      ];
    }

    const events = await LiveEvent.find(filter)
      .populate("instructor", "username role")
      .populate("course", "title");

    const filteredEvents =
      req.user.role === "student"
        ? events.filter((event) => event.instructor?.role === "admin")
        : events;

    res.status(200).json({
      success: true,
      count: filteredEvents.length,
      data: filteredEvents,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update live event
// @route   PUT /api/v1/live-events/:id
// @access  Private (Admin/Instructor)
exports.updateLiveEvent = async (req, res) => {
  try {
    let liveEvent = await LiveEvent.findById(req.params.id);

    if (!liveEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if owner or admin
    if (
      liveEvent.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    liveEvent = await LiveEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: liveEvent,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete live event
// @route   DELETE /api/v1/live-events/:id
// @access  Private (Admin/Instructor)
exports.deleteLiveEvent = async (req, res) => {
  try {
    const liveEvent = await LiveEvent.findById(req.params.id);

    if (!liveEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (
      liveEvent.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    await LiveEvent.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single live event
// @route   GET /api/v1/live-events/:id
// @access  Private
exports.getLiveEventById = async (req, res) => {
  try {
    const liveEvent = await LiveEvent.findById(req.params.id)
      .populate("instructor")
      .populate("course");

    if (!liveEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      data: liveEvent,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get upcoming live events for instructor
// @route   GET /api/v1/live-events/my-events/upcoming
// @access  Private (Instructor)
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const filter = {
      instructor: req.user.id,
      startTime: { $gte: now },
      status: { $ne: "cancelled" },
    };

    const events = await LiveEvent.find(filter)
      .populate("course", "title")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all live events for instructor's dashboard
// @route   GET /api/v1/live-events/my-events
// @access  Private (Instructor)
exports.getMyLiveEvents = async (req, res) => {
  try {
    const { status, courseId } = req.query;
    let filter = { instructor: req.user.id };

    if (status) {
      filter.status = status;
    }
    if (courseId) {
      filter.course = courseId;
    }

    const events = await LiveEvent.find(filter)
      .populate("course", "title")
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update event status
// @route   PUT /api/v1/live-events/:id/status
// @access  Private (Instructor/Admin)
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["upcoming", "live", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    let liveEvent = await LiveEvent.findById(req.params.id);

    if (!liveEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (
      liveEvent.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    liveEvent = await LiveEvent.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: liveEvent,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
