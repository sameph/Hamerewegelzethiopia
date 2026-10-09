const express = require("express");
const {
  createLiveEvent,
  getLiveEvents,
  getTodayLiveEvents,
  getLiveEventById,
  updateLiveEvent,
  deleteLiveEvent,
  getUpcomingEvents,
  getMyLiveEvents,
  updateEventStatus,
} = require("../controllers/liveEventController");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// Get my events (for instructors)
router.get(
  "/my-events/upcoming",
  authorize("instructor", "admin"),
  getUpcomingEvents
);
router.get("/my-events", authorize("instructor", "admin"), getMyLiveEvents);

router
  .route("/")
  .get(getLiveEvents)
  .post(authorize("instructor", "admin"), createLiveEvent);

router.get("/today", getTodayLiveEvents);

router
  .route("/:id")
  .get(getLiveEventById)
  .put(authorize("instructor", "admin"), updateLiveEvent)
  .delete(authorize("instructor", "admin"), deleteLiveEvent);

router.put("/:id/status", authorize("instructor", "admin"), updateEventStatus);

module.exports = router;
