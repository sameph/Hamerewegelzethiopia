"use client";

import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

type CalendarEvent = {
  id: string;
  title: string;
  dateObj: Date;
  time: string;
  location: string;
  type: string;
  link?: string;
};

export default function CalendarClient() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("lms_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [submissionsRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/assignments/submissions`, { headers }),
          fetch(`${API_URL}/live-events`, { headers }),
        ]);

        let assignments: any[] = [];
        let liveEvents: any[] = [];

        if (submissionsRes.ok) {
          const dataS = await submissionsRes.json();
          if (dataS.success) {
            assignments = dataS.data.map((s: any) => ({
              id: s._id,
              title: `Assignment: ${s.assignment.title}`,
              dateObj: new Date(s.assignment.dueDate),
              time: new Date(s.assignment.dueDate).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
              location: "Learning Portal",
              type: "assignment",
            }));
          }
        }

        if (eventsRes.ok) {
          const dataE = await eventsRes.json();
          if (dataE.success) {
            liveEvents = dataE.data.map((e: any) => ({
              id: e._id,
              title: `Live Session: ${e.title}`,
              dateObj: new Date(e.startTime),
              time: new Date(e.startTime).toLocaleDateString(undefined, {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
              location: e.meetingLink || "Virtual Classroom",
              type: "live-event",
              link: e.meetingLink,
            }));
          }
        }

        setEvents(
          [...assignments, ...liveEvents].sort(
            (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
          )
        );
      } catch (err) {
        console.error("Fetch calendar events failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const monthStart = new Date(year, currentDate.getMonth(), 1);
  const monthEnd = new Date(year, currentDate.getMonth() + 1, 0);
  const startOffset = monthStart.getDay();
  const totalDays = monthEnd.getDate();

  const calendarCells = Array.from({ length: 42 }, (_, idx) => {
    const dayNumber = idx - startOffset + 1;
    if (dayNumber < 1 || dayNumber > totalDays) {
      return null;
    }
    return new Date(year, currentDate.getMonth(), dayNumber);
  });

  const eventsByDate = events.reduce((map, event) => {
    const key = formatDateKey(event.dateObj);
    const existing = map.get(key) || [];
    map.set(key, [...existing, event]);
    return map;
  }, new Map<string, CalendarEvent[]>());

  const selectedKey = formatDateKey(selectedDate);
  const selectedEvents = eventsByDate.get(selectedKey) || [];

  const hasEvents = (date: Date) => eventsByDate.has(formatDateKey(date));
  const isToday = (date: Date) =>
    formatDateKey(date) === formatDateKey(new Date());
  const isSelected = (date: Date) => formatDateKey(date) === selectedKey;

  const goPreviousMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goNextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#06110c] via-[#09130f] to-[#0e1c15] p-12 shadow-[0_40px_120px_rgba(0,0,0,0.35)] overflow-hidden relative">
        <div className="absolute inset-x-10 top-10 h-52 rounded-full bg-[#a5ff63]/10 blur-[120px]" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#a5ff63]/15 bg-[#a5ff63]/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#a5ff63]">
            Student Planner
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl">
            Live Classes on Your Calendar
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            See your enrolled live sessions and assignment deadlines mapped
            directly to calendar dates. Every day becomes a clear milestone in
            an amazing learning experience.
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-[2.5rem] border border-white/10 bg-[#0b1810] p-8 shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                {monthName} {year}
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Your Student Calendar
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-2">
              <button
                onClick={goPreviousMonth}
                className="rounded-2xl p-3 text-slate-300 hover:bg-white/10 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNextMonth}
                className="rounded-2xl p-3 text-slate-300 hover:bg-white/10 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-7 gap-3 text-center text-[11px] uppercase tracking-[0.3em] text-slate-500">
            {weekDays.map((day) => (
              <div key={day} className="py-3 rounded-3xl bg-white/5">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-7 gap-3">
            {calendarCells.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => date && setSelectedDate(date)}
                disabled={!date}
                className={`group min-h-[140px] rounded-[2rem] border p-4 text-left transition-all ${
                  date
                    ? `border-white/10 bg-white/5 hover:border-[#a5ff63]/30 hover:bg-[#a5ff63]/10 ${
                        isSelected(date)
                          ? "border-[#a5ff63] bg-[#a5ff63]/10"
                          : ""
                      }`
                    : "cursor-default border-transparent bg-transparent"
                }`}
              >
                {date ? (
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-sm font-black ${
                        isSelected(date) ? "text-[#a5ff63]" : "text-white"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {isToday(date) && (
                      <span className="rounded-full bg-[#a5ff63]/20 px-2 py-0.5 text-[10px] font-black text-[#a5ff63]">
                        Today
                      </span>
                    )}
                  </div>
                ) : null}

                {date && (
                  <div className="mt-4 space-y-2">
                    {(eventsByDate.get(formatDateKey(date)) || [])
                      .slice(0, 3)
                      .map((event: CalendarEvent) => (
                        <div
                          key={event.id}
                          className="rounded-2xl bg-slate-900/70 px-3 py-2 text-[11px] font-semibold text-slate-100"
                        >
                          <span className="block truncate">{event.title}</span>
                        </div>
                      ))}
                    {hasEvents(date) &&
                      eventsByDate.get(formatDateKey(date))!.length > 3 && (
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                          +{eventsByDate.get(formatDateKey(date))!.length - 3}{" "}
                          more
                        </div>
                      )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-[2.5rem] border border-white/10 bg-[#0b1810] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon className="text-[#a5ff63]" size={20} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Events for
              </p>
              <h3 className="text-2xl font-black text-white">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-[#a5ff63]" size={32} />
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Loading events...
              </p>
            </div>
          ) : selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map((event: CalendarEvent) => (
                <div
                  key={event.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:border-[#a5ff63]/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        {event.type === "live-event"
                          ? "Live Class"
                          : "Assignment"}
                      </p>
                      <h4 className="mt-2 text-lg font-black text-white">
                        {event.title}
                      </h4>
                    </div>
                    <span className="rounded-full bg-[#a5ff63]/10 px-3 py-1 text-xs font-black text-[#a5ff63]">
                      {event.type === "live-event" ? "Live" : "Due"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {event.link ? (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#a5ff63] hover:underline"
                        >
                          Join Session
                        </a>
                      ) : (
                        <span>{event.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
                No events
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Select a highlighted day to see assignments or live lessons.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
