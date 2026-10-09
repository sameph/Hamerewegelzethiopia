"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Clock, Video, Loader2, Calendar, X, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface LiveEvent {
  _id: string;
  title: string;
  description?: string;
  course?: { _id: string; title: string } | string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
}

interface Course {
  _id: string;
  title: string;
}

export default function TeacherCalendarModule() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LiveEvent | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [status, setStatus] = useState<"upcoming" | "live" | "completed" | "cancelled">("upcoming");

  const token = typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const fetchEventsAndCourses = async () => {
    setLoading(true);
    try {
      const [eventsRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/live-events`, { headers }),
        fetch(`${API_URL}/courses`, { headers }) // Teacher can search general courses to assign to
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (eventsData.success) {
          setEvents(eventsData.data);
        }
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        if (coursesData.success) {
          setCourses(coursesData.data);
        }
      }
    } catch (err) {
      console.error("Failed to load events/courses:", err);
      toast.error("Network error sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsAndCourses();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setSelectedCourse("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setMeetingLink("");
    setStatus("upcoming");
    setModalOpen(true);
  };

  const openEditModal = (event: LiveEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setSelectedCourse(typeof event.course === "object" ? event.course._id : event.course || "");
    
    // Parse Dates to string format for inputs
    const startObj = new Date(event.startTime);
    const endObj = new Date(event.endTime);
    
    const yyyy = startObj.getFullYear();
    const mm = String(startObj.getMonth() + 1).padStart(2, "0");
    const dd = String(startObj.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
    
    setStartTime(startObj.toTimeString().substring(0, 5));
    setEndTime(endObj.toTimeString().substring(0, 5));
    setMeetingLink(event.meetingLink || "");
    setStatus(event.status || "upcoming");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    const payload = {
      title,
      description,
      course: selectedCourse || undefined,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      meetingLink,
      status
    };

    try {
      let res;
      if (editingEvent) {
        // Update Event
        res = await fetch(`${API_URL}/live-events/${editingEvent._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        // Create Event
        res = await fetch(`${API_URL}/live-events`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(editingEvent ? "Event updated successfully!" : "Live Event scheduled successfully!");
        setModalOpen(false);
        fetchEventsAndCourses();
      } else {
        toast.error(data.message || "Failed to save event");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong saving the event");
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this live event? Enrolled students will no longer see it.")) return;

    try {
      const res = await fetch(`${API_URL}/live-events/${eventId}`, {
        method: "DELETE",
        headers
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Event deleted from calendar");
        fetchEventsAndCourses();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong deleting the event");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-750">
      {/* Overview/Welcome bar */}
      <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0d1610] to-[#08120f] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-[10px] font-black uppercase tracking-[0.2em] text-mint">Instructor Scheduling</div>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{events.length} Scheduled Sessions</div>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">Live Event <span className="text-mint">Scheduler.</span></h2>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-3 rounded-2xl bg-mint px-6 py-4 text-sm font-black text-[#08120f] shadow-lg shadow-mint/20 hover:scale-[1.05] active:scale-95 transition-all shrink-0"
          >
            <Plus size={18} /> Schedule Session
          </button>
        </div>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-mint/5 blur-[120px]" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-mint" size={40} />
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Synchronizing events database...</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active schedule list */}
          <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-[#0d1610]/95 p-10 shadow-2xl space-y-6">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 border-b border-white/5 pb-6">
              <Calendar className="text-mint" size={24} />
              Active Live Event Timeline
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {events.length > 0 ? (
                events.map((evt) => (
                  <div key={evt._id} className="rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-mint">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          evt.status === "live" ? "bg-red-500/20 text-red-400 border border-red-500/35 animate-pulse" :
                          evt.status === "completed" ? "bg-slate-700/20 text-slate-400 border border-white/10" :
                          evt.status === "cancelled" ? "bg-rose-950/20 text-rose-300 border border-rose-900/30" :
                          "bg-mint/10 text-mint border border-mint/20"
                        }`}>
                          {evt.status}
                        </span>
                        {evt.course && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-[#d6ff00] uppercase tracking-wider">
                            <BookOpen size={10} />
                            {typeof evt.course === "object" ? evt.course.title : "Assigned Course"}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-white leading-snug">{evt.title}</h4>
                      {evt.description && <p className="text-sm text-slate-400 font-medium line-clamp-2">{evt.description}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mt-2">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(evt.startTime).toLocaleDateString()} {new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(evt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {evt.meetingLink && (
                        <a 
                          href={evt.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#d6ff00] transition-colors"
                          title="Open Meeting Link"
                        >
                          <Video size={16} />
                        </a>
                      )}
                      <button 
                        onClick={() => openEditModal(evt)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-mint transition-colors"
                        title="Edit Event"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(evt._id)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 border border-dashed border-white/5 rounded-3xl text-center space-y-4">
                  <Calendar className="mx-auto text-slate-700" size={50} />
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">No Events scheduled</p>
                  <p className="text-xs text-slate-600">Click the button in the header card to arrange a virtual classroom.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick links & tips panel */}
          <div className="space-y-6">
            <section className="rounded-[2.5rem] border border-white/10 bg-[#0d1610]/95 p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Scheduling Guidelines</h3>
              <ul className="space-y-3 text-xs text-slate-400 leading-relaxed font-medium">
                <li className="flex gap-2">
                  <span className="text-mint">✓</span>
                  <span><strong>Virtual Class Integration:</strong> Add links for Zoom, Google Meet or Microsoft Teams so users can join immediately.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-mint">✓</span>
                  <span><strong>Visibility:</strong> Events are synchronized dynamically to registered student homepage dashboards and calendars.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-mint">✓</span>
                  <span><strong>Course Focus:</strong> Optionally link events to a Course to filter participation by class list.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#0d1610] p-10 shadow-2xl space-y-6">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-2xl font-black text-white tracking-tight">
              {editingEvent ? "Edit Live Event" : "Create Live Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Event Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Biblical Hermeneutics Session 1"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about materials to read or what will be studied..."
                  className="w-full h-24 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-mint transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Associated Course (Optional)</label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#08120f] px-3 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                  >
                    <option value="">-- General / Public --</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-2xl border border-white/10 bg-[#08120f] px-3 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Event Date *</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Start Time *</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">End Time *</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Virtual Meeting Link (Zoom / Meet) *</label>
                <input 
                  type="url" 
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  required
                  placeholder="https://zoom.us/j/12345678"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-mint transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 rounded-2xl bg-mint text-[#08120f] text-sm font-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-mint/10"
              >
                {editingEvent ? "Update Scheduled Session" : "Schedule Live Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
