"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/lib/useNotification";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: "Live" | "Online" | "Class";
  course?: { title: string };
  status: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TeacherCalendarNewModule() {
  const { user } = useAuth();
  const { error } = useNotification();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchEvents();
    }
  }, [user, currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/live-events/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
      }
    } catch (err) {
      error("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const getEventsForDate = (day: number): Event[] => {
    const dateKey = formatDateKey(day);
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      const eventDateKey = formatDateKey(eventDate.getDate());
      return eventDateKey === dateKey;
    });
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInPrevMonth = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

    const days: CalendarDay[] = [];
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear();

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = isCurrentMonth && today.getDate() === i;
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        events: getEventsForDate(i),
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const dayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
    setSelectedDate(null);
  };

  if (!user || user.role !== "instructor") {
    return (
      <div className="text-center text-slate-400">
        You do not have permission to view teacher calendar
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Calendar</h2>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{monthName}</h3>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-slate-400 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
                className={`aspect-square p-2 rounded-lg text-sm font-semibold transition relative ${
                  day.isToday
                    ? "bg-[#a5ff63] text-black"
                    : day.isCurrentMonth
                    ? selectedDate === day.date
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white hover:bg-white/10"
                    : "text-slate-600 bg-transparent"
                }`}
              >
                <div>{day.date}</div>
                {day.events.length > 0 && (
                  <div className="absolute bottom-1 inset-x-1 flex gap-0.5 justify-center">
                    {day.events.slice(0, 2).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-[#a5ff63]"
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedDate
              ? `Events - ${currentDate.toLocaleString("default", {
                  month: "short",
                })} ${selectedDate}`
              : "Upcoming Events"}
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-slate-400 text-sm">Loading events...</p>
            ) : (selectedDate ? dayEvents : events.slice(0, 5)).length === 0 ? (
              <p className="text-slate-400 text-sm">No events scheduled</p>
            ) : (
              (selectedDate ? dayEvents : events.slice(0, 5)).map((event) => (
                <div
                  key={event._id}
                  className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm"
                >
                  <p className="font-semibold text-white truncate">
                    {event.title}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span>
                        {new Date(event.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {event.course && (
                      <div className="flex items-center gap-2">
                        <Users size={12} />
                        <span>{event.course.title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span className="capitalize">{event.type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
