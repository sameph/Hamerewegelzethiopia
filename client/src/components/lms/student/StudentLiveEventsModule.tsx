"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/lib/useNotification";
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface LiveEvent {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  course?: { _id: string; title: string };
  instructor: { username: string; role?: string };
  status: "upcoming" | "live" | "completed" | "cancelled";
  type: "Live" | "Online" | "Class";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function StudentLiveEventsModule() {
  const { user } = useAuth();
  const { error } = useNotification();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "live" | "completed"
  >("all");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;

  useEffect(() => {
    if (user) {
      fetchEvents();
      // Refresh every 30 seconds
      const interval = setInterval(fetchEvents, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Fetch live events and sermons in parallel
      const [eventsRes, sermonsRes] = await Promise.all([
        fetch(`${API_URL}/live-events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/sermons`),
      ]);

      const eventsData = await eventsRes.json();
      const sermonsData = await sermonsRes.json();

      if (eventsData.success) {
        // Filter live events to admin-posted only
        const liveEventsFiltered = (eventsData.data || []).filter(
          (event: any) => event.instructor?.role === "admin"
        );

        // Filter sermons to exclude demos
        const sermonsFiltered = (sermonsData.data || [])
          .filter((sermon: any) => !sermon.isDemo)
          .map((sermon: any) => ({
            _id: sermon._id,
            title: sermon.title,
            description: sermon.description || `by ${sermon.speaker}`,
            startTime: sermon.createdAt,
            endTime: sermon.createdAt,
            meetingLink: sermon.youtubeUrl || "",
            course: undefined,
            instructor: { username: sermon.speaker, role: "admin" },
            status: "completed" as const,
            type: "Sermon" as any,
          }));

        setEvents([...liveEventsFiltered, ...sermonsFiltered]);
      }
    } catch (err) {
      error("Failed to load live events");
    } finally {
      setLoading(false);
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

  const getTimeUntilEvent = (startTime: string): string => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diff = eventTime.getTime() - now.getTime();

    if (diff < 0) return "Event started";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days > 1 ? "s" : ""}`;
    }

    return `in ${hours}h ${minutes}m`;
  };

  const statusStyles: Record<
    string,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    upcoming: {
      bg: "bg-blue-900/30",
      text: "text-blue-400",
      border: "border-blue-500/30",
      icon: <AlertCircle size={16} />,
    },
    live: {
      bg: "bg-red-900/30",
      text: "text-red-400",
      border: "border-red-500/30",
      icon: <AlertCircle size={16} />,
    },
    completed: {
      bg: "bg-green-900/30",
      text: "text-green-400",
      border: "border-green-500/30",
      icon: <CheckCircle size={16} />,
    },
    cancelled: {
      bg: "bg-gray-900/30",
      text: "text-gray-400",
      border: "border-gray-500/30",
      icon: <AlertCircle size={16} />,
    },
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.status === filter;
  });

  const upcomingEvents = filteredEvents.filter((e) => e.status === "upcoming");
  const liveEvents = filteredEvents.filter((e) => e.status === "live");
  const completedEvents = filteredEvents.filter(
    (e) => e.status === "completed"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Live Events & Classes</h2>
        <p className="text-slate-400 mt-1">Join your live classes and events</p>
      </div>

      {/* Live Events Alert */}
      {liveEvents.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500/50 bg-red-900/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-semibold text-red-400">
                {liveEvents.length} Event(s) Happening Now!
              </p>
              <p className="text-sm text-red-300 mt-1">
                Join now to participate in the live session
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "upcoming", "live", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === status
                ? "bg-[#a5ff63] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
          <p className="text-slate-300">
            No {filter !== "all" ? filter : ""} events scheduled
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const styles = statusStyles[event.status];
            return (
              <div
                key={event._id}
                className={`rounded-2xl border ${styles.border} ${styles.bg} p-6 hover:bg-opacity-50 transition`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    {/* Title and Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {event.title}
                      </h3>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.text} border ${styles.border}`}
                      >
                        {styles.icon}
                        <span>
                          {event.status.charAt(0).toUpperCase() +
                            event.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details Grid */}
                    <div className="grid gap-3 sm:grid-cols-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar
                          size={16}
                          className="text-[#a5ff63] flex-shrink-0"
                        />
                        <span>{formatDate(event.startTime)}</span>
                      </div>

                      {event.course && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Users
                            size={16}
                            className="text-[#a5ff63] flex-shrink-0"
                          />
                          <span>{event.course.title}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Clock
                          size={16}
                          className="text-[#a5ff63] flex-shrink-0"
                        />
                        <span>
                          Duration:{" "}
                          {Math.round(
                            (new Date(event.endTime).getTime() -
                              new Date(event.startTime).getTime()) /
                              60000
                          )}{" "}
                          min
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                          {event.type}
                        </span>
                        <span className="text-[#a5ff63] font-semibold">
                          {event.status === "upcoming" &&
                            getTimeUntilEvent(event.startTime)}
                          {event.status === "live" && "Happening now!"}
                        </span>
                      </div>
                    </div>

                    {/* Instructor */}
                    <p className="text-xs text-slate-400">
                      Instructor: {event.instructor.username}
                    </p>
                  </div>

                  {/* Join Button */}
                  <a
                    href={event.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
                      event.status === "live"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : event.status === "upcoming"
                        ? "bg-[#a5ff63] text-black hover:bg-[#d6ff00]"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    <LinkIcon size={16} />
                    {event.status === "live"
                      ? "Join Now"
                      : event.status === "completed"
                      ? "View Recording"
                      : "Join Meeting"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
