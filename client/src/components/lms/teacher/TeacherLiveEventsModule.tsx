"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/lib/useNotification";
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  Users,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";

interface LiveEvent {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  course?: { _id: string; title: string };
  status: "upcoming" | "live" | "completed" | "cancelled";
  type: "Live" | "Online" | "Class";
}

interface Course {
  _id: string;
  title: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TeacherLiveEventsModule() {
  const { user } = useAuth();
  const { success, error, info } = useNotification();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LiveEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Online",
    startTime: "",
    endTime: "",
    meetingLink: "",
    course: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;

  // Fetch events
  useEffect(() => {
    if (!user || user.role !== "instructor") return;
    fetchEvents();
    fetchCourses();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/live-events/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch courses");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.meetingLink
    ) {
      error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent
        ? `${API_URL}/live-events/${editingEvent._id}`
        : `${API_URL}/live-events`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        success(
          editingEvent
            ? "Event updated successfully"
            : "Event created successfully"
        );
        setShowForm(false);
        setEditingEvent(null);
        setFormData({
          title: "",
          description: "",
          type: "Online",
          startTime: "",
          endTime: "",
          meetingLink: "",
          course: "",
        });
        fetchEvents();
      } else {
        error(data.message || "Failed to save event");
      }
    } catch (err) {
      error("Error saving event");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: LiveEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: new Date(event.endTime).toISOString().slice(0, 16),
      meetingLink: event.meetingLink,
      course: event.course?._id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${API_URL}/live-events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        success("Event deleted successfully");
        fetchEvents();
      } else {
        error(data.message || "Failed to delete event");
      }
    } catch (err) {
      error("Error deleting event");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStyles: Record<string, string> = {
    upcoming: "bg-blue-900/30 text-blue-400 border-blue-500/30",
    live: "bg-red-900/30 text-red-400 border-red-500/30",
    completed: "bg-green-900/30 text-green-400 border-green-500/30",
    cancelled: "bg-gray-900/30 text-gray-400 border-gray-500/30",
  };

  if (!user || user.role !== "instructor") {
    return (
      <div className="text-center text-slate-400">
        You do not have permission to manage live events
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live Events</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setFormData({
              title: "",
              description: "",
              type: "Online",
              startTime: "",
              endTime: "",
              meetingLink: "",
              course: "",
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#a5ff63] px-4 py-2 font-semibold text-black hover:bg-[#d6ff00] transition"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleInputChange}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
              >
                <option value="Online">Online</option>
                <option value="Live">Live</option>
                <option value="Class">Class</option>
              </select>
            </div>

            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
              rows={3}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                required
              />
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                required
              />
            </div>

            <input
              type="url"
              name="meetingLink"
              placeholder="Meeting Link (Zoom, Google Meet, etc.)"
              value={formData.meetingLink}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
              required
            />

            <select
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
            >
              <option value="">Select a course (optional)</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[#a5ff63] px-4 py-2 font-semibold text-black hover:bg-[#d6ff00] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Event"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {loading && !events.length ? (
          <div className="text-center py-8 text-slate-400">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-white/20 bg-white/5 p-8 text-center">
            <p className="text-slate-300">
              No live events yet. Create one to get started!
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="rounded-2xl border border-white/20 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {event.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                        statusStyles[event.status]
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">
                    {event.description}
                  </p>

                  <div className="grid gap-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#a5ff63]" />
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#a5ff63]" />
                      <span>
                        Duration:{" "}
                        {Math.round(
                          (new Date(event.endTime).getTime() -
                            new Date(event.startTime).getTime()) /
                            60000
                        )}{" "}
                        minutes
                      </span>
                    </div>
                    {event.course && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#a5ff63]" />
                        <span>{event.course.title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <LinkIcon size={16} className="text-[#a5ff63]" />
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a5ff63] hover:text-[#d6ff00]"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
