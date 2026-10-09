"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  CheckCircle2,
  Circle,
  Menu,
  X,
  Settings,
  BookOpen,
  Trophy,
  ArrowRight,
  Loader2,
  Clock,
  Download,
  Youtube,
  Paperclip,
  BarChart,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";
const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

const resolveFileUrl = (url: string) =>
  url?.startsWith("/uploads") ? `${FILE_BASE_URL}${url}` : url;

const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

interface Lesson {
  _id: string;
  title: string;
  type: "video" | "document" | "reading" | "material";
  content?: string;
  videoUrl?: string;
  videoId?: string;
  duration?: string;
  materials?: { name: string; url: string; fileType: string }[];
  order: number;
  chapter?: string;
  status: "draft" | "published";
}

interface Assignment {
  _id: string;
  title: string;
  instructions?: string;
  dueDate: string;
  status: "draft" | "published";
  attachments?: { name: string; url: string; fileType: string }[];
}

interface Chapter {
  _id: string;
  title: string;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
}

interface Progress {
  completedLessons: string[];
  percentComplete: number;
  lastLesson?: string;
}

export default function CourseLearningPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    percentComplete: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"content" | "assignments">(
    "content"
  );
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    content: "",
    fileUrl: "",
  });

  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [
          courseRes,
          chaptersRes,
          lessonsRes,
          progressRes,
          assignmentsRes,
          submissionsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/courses/${courseId}`, { headers }),
          fetch(`${API_URL}/chapters/course/${courseId}`, { headers }),
          fetch(`${API_URL}/courses/${courseId}/lessons`, { headers }),
          fetch(`${API_URL}/courses/${courseId}/progress`, { headers }),
          fetch(`${API_URL}/assignments/course/${courseId}`, { headers }),
          fetch(`${API_URL}/assignments/submissions`, { headers }),
        ]);

        const courseData = courseRes.ok
          ? await courseRes.json()
          : { success: false };
        const chaptersData = chaptersRes.ok
          ? await chaptersRes.json()
          : { success: false };
        const lessonsData = lessonsRes.ok
          ? await lessonsRes.json()
          : { success: false };
        const progressData = progressRes.ok
          ? await progressRes.json()
          : { success: false };
        const assignmentsData = assignmentsRes.ok
          ? await assignmentsRes.json()
          : { success: false };
        const submissionsData = submissionsRes.ok
          ? await submissionsRes.json()
          : { success: false };

        if (courseData.success) setCourse(courseData.data);
        if (chaptersData.success)
          setChapters(
            chaptersData.data.sort((a: any, b: any) => a.order - b.order)
          );

        if (assignmentsData.success) setAssignments(assignmentsData.data);
        if (submissionsData.success) setSubmissions(submissionsData.data);

        if (lessonsData.success) {
          const sortedLessons = lessonsData.data.sort(
            (a: any, b: any) => a.order - b.order
          );
          setLessons(sortedLessons);

          if (progressData.success && progressData.data.lastLesson) {
            const last = sortedLessons.find(
              (l: any) => l._id === progressData.data.lastLesson
            );
            setCurrentLesson(last || sortedLessons[0]);
          } else {
            setCurrentLesson(sortedLessons[0]);
          }
        }
        if (progressData.success) setProgress(progressData.data);
      } catch (err) {
        console.error("Fetch learning data failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!courseId) return;
    try {
      const res = await fetch(
        `${API_URL}/courses/${courseId}/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setProgress(data.data);
      }
    } catch (err) {
      console.error("Update progress failed:", err);
    }
  };

  const handleUnenroll = async () => {
    if (
      !courseId ||
      !confirm(
        "Are you sure you want to unenroll? All your progress will be permanently deleted."
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/unenroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        router.push("/"); // Redirect to home after unenrollment
      }
    } catch (err) {
      console.error("Unenrollment failed:", err);
    }
  };

  const handleAssignmentSubmit = async (assignmentId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
        body: JSON.stringify(submissionForm),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions([...submissions, data.data]);
        setSubmissionForm({ content: "", fileUrl: "" });
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
    setIsSubmitting(false);
  };

  const getNextLesson = () => {
    if (!currentLesson) return null;
    const idx = lessons.findIndex((l) => l._id === currentLesson._id);
    return idx < lessons.length - 1 ? lessons[idx + 1] : null;
  };

  const getPrevLesson = () => {
    if (!currentLesson) return null;
    const idx = lessons.findIndex((l) => l._id === currentLesson._id);
    return idx > 0 ? lessons[idx - 1] : null;
  };

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#08120f] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-mint" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Synchronizing Curriculum...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#08120f] overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 transform bg-[#0d1610] border-r border-white/10 transition-transform duration-500 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-[#d6ff00]" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Course Progress
              </span>
            </div>
            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#d6ff00] transition-all duration-1000"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-xs font-black text-white">
                {progress.percentComplete}%{" "}
                <span className="text-slate-500 font-medium">Complete</span>
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {progress.completedLessons.length} / {lessons.length}
              </span>
            </div>
          </div>

          <div className="px-4 py-6 border-b border-white/10">
            <div className="flex bg-white/5 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === "content"
                    ? "bg-[#d6ff00] text-[#08120f] shadow-lg shadow-[#d6ff00]/10"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                <BookOpen size={14} /> Curriculum
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === "assignments"
                    ? "bg-[#d6ff00] text-[#08120f] shadow-lg shadow-[#d6ff00]/10"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                <FileText size={14} /> Assignments
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
            {activeTab === "content" ? (
              chapters.map((chapter) => (
                <div key={chapter._id} className="space-y-4">
                  <h4 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {chapter.title}
                  </h4>
                  <div className="space-y-1">
                    {lessons
                      .filter((l) => l.chapter === chapter._id)
                      .map((lesson) => (
                        <button
                          key={lesson._id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 group ${
                            currentLesson?._id === lesson._id
                              ? "bg-mint/10 border border-mint/20 text-mint"
                              : "text-slate-400 hover:bg-white/5"
                          }`}
                        >
                          <div className="shrink-0">
                            {progress.completedLessons.includes(lesson._id) ? (
                              <CheckCircle2 size={18} className="text-mint" />
                            ) : (
                              <Circle
                                size={18}
                                className="group-hover:text-slate-300"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-bold truncate ${
                                currentLesson?._id === lesson._id
                                  ? "text-white"
                                  : ""
                              }`}
                            >
                              {lesson.title}
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 space-y-4">
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest px-2">
                  Pending Evaluations
                </p>
                {assignments.map((a) => (
                  <button
                    key={a._id}
                    onClick={() => setActiveTab("assignments")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#d6ff00]/30 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400">
                        <FileText size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">
                          {a.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          {new Date(a.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-[#08120f] to-[#040a08]">
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#08120f]/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-black text-white tracking-tight line-clamp-1">
              {course?.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleUnenroll}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all mr-4"
            >
              <X size={16} /> Unenroll from Module
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
            >
              <ChevronLeft size={16} /> Exit Stage
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000">
            {activeTab === "content" ? (
              currentLesson ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-[10px] font-black uppercase tracking-[0.2em] text-mint">
                        Module in Focus
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {currentLesson.type}
                      </span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                      {currentLesson.title}
                    </h2>
                  </div>

                  <div className="rounded-[3rem] overflow-hidden border border-white/10 bg-[#0d1610] shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                    {currentLesson.type === "video" ? (
                      <div className="aspect-video bg-black flex items-center justify-center group cursor-pointer relative">
                        {(() => {
                          const embedId =
                            currentLesson.videoId ||
                            extractYoutubeId(currentLesson.videoUrl || "");
                          return embedId ? (
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${embedId}`}
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title="Lesson Video"
                            />
                          ) : (
                            <div className="text-center space-y-4">
                              <PlayCircle
                                className="mx-auto text-mint/20 group-hover:text-mint transition-all"
                                size={80}
                              />
                              <p className="text-slate-500 font-bold uppercase tracking-widest">
                                Video Stream Unavailable
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="p-12 prose prose-invert max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                          {currentLesson.content ||
                            "No textual content defined for this lesson."}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentLesson.materials &&
                    currentLesson.materials.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
                          <Download className="text-[#d6ff00]" size={20} />
                          Enriched Resources
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {currentLesson.materials.map((m, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const resolvedUrl = resolveFileUrl(m.url);
                                if (
                                  m.fileType === "pdf" ||
                                  m.url.toLowerCase().endsWith(".pdf")
                                ) {
                                  setActivePdfUrl(resolvedUrl);
                                  setActivePdfTitle(m.name);
                                } else {
                                  window.open(
                                    resolvedUrl,
                                    "_blank",
                                    "noopener,noreferrer"
                                  );
                                }
                              }}
                              className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-[#d6ff00]/30 hover:bg-white/[0.06] transition-all group text-left w-full"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#d6ff00] transition-colors">
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <p className="font-black text-white group-hover:text-[#d6ff00] transition-colors">
                                    {m.name}
                                  </p>
                                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                    {m.fileType}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight
                                className="text-slate-700 group-hover:text-[#d6ff00] transition-colors"
                                size={20}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="flex items-center justify-between pt-12 border-t border-white/10 mt-20">
                    <button
                      disabled={!getPrevLesson()}
                      onClick={() => setCurrentLesson(getPrevLesson())}
                      className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft size={20} /> Regression
                    </button>

                    {!progress.completedLessons.includes(currentLesson._id) ? (
                      <button
                        onClick={() => handleLessonComplete(currentLesson._id)}
                        className="rounded-2xl bg-[#d6ff00] px-12 py-5 text-sm font-black text-[#08120f] shadow-2xl shadow-[#d6ff00]/20 hover:scale-[1.05] active:scale-95 transition-all"
                      >
                        Validate & Continue
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 text-[#d6ff00] font-black uppercase tracking-widest text-sm">
                        <CheckCircle2 size={24} /> Mastery Confirmed
                      </div>
                    )}

                    <button
                      disabled={!getNextLesson()}
                      onClick={() => setCurrentLesson(getNextLesson())}
                      className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-[#d6ff00] hover:text-white disabled:opacity-20 transition-all"
                    >
                      Progression <ChevronRight size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
                  <BookOpen className="text-slate-800" size={80} />
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">
                    Curriculum Empty
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    This stage contains no valid modules. Please contact the
                    architect.
                  </p>
                </div>
              )
            ) : (
              /* Assignments View */
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#d6ff00]/10 border border-[#d6ff00]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#d6ff00]">
                      Strategic Evaluation
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                    Strategic Evaluations
                  </h2>
                </div>

                <div className="grid gap-8">
                  {assignments.map((assignment) => {
                    const submission = submissions.find(
                      (s) =>
                        s.assignment === assignment._id ||
                        s.assignment?._id === assignment._id
                    );
                    return (
                      <div
                        key={assignment._id}
                        className="rounded-[3rem] border border-white/10 bg-[#0d1610] p-12 shadow-2xl space-y-10"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="space-y-2">
                            <h3 className="text-3xl font-black text-white tracking-tight">
                              {assignment.title}
                            </h3>
                            <div className="prose prose-invert max-w-2xl text-slate-400">
                              <p className="text-lg leading-relaxed">
                                {assignment.instructions}
                              </p>
                            </div>
                            {assignment.attachments &&
                              assignment.attachments.length > 0 && (
                                <div className="mt-6 space-y-3">
                                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                    Resource Handouts
                                  </p>
                                  <div className="flex flex-wrap gap-3">
                                    {assignment.attachments.map(
                                      (file: any, i: number) => (
                                        <a
                                          key={i}
                                          href={resolveFileUrl(file.url)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white hover:border-mint transition-all"
                                        >
                                          <Paperclip size={14} /> {file.name}
                                        </a>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-3">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                              Assignment Status
                            </span>
                            {submission ? (
                              <div className="px-6 py-3 rounded-2xl bg-[#d6ff00]/10 border border-[#d6ff00]/20 flex items-center gap-3 text-[#d6ff00]">
                                <CheckCircle2 size={20} />
                                <span className="text-sm font-black uppercase tracking-widest">
                                  Submitted
                                </span>
                              </div>
                            ) : (
                              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-slate-500">
                                <Clock size={20} />
                                <span className="text-sm font-black uppercase tracking-widest">
                                  Pending
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {submission ? (
                          <div className="pt-10 border-t border-white/5 grid lg:grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                Your Execution Content
                              </p>
                              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {submission.content}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase text-[#d6ff00]/60 tracking-widest">
                                Architect Evaluation
                              </p>
                              {submission.status === "reviewed" ? (
                                <div className="p-8 rounded-3xl bg-[#d6ff00]/5 border border-[#d6ff00]/20">
                                  <div className="flex items-center gap-4 mb-6">
                                    <div className="text-5xl font-black text-white">
                                      {submission.grade}
                                    </div>
                                    <div className="h-10 w-[2px] bg-white/10" />
                                    <span className="text-[10px] font-black text-[#d6ff00] uppercase tracking-widest">
                                      Mastery Points gained
                                    </span>
                                  </div>
                                  <p className="text-slate-400 italic text-lg leading-relaxed">
                                    &quot;
                                    {submission.feedback ||
                                      "Exceptional theoretical understanding demonstrated."}
                                    &quot;
                                  </p>
                                </div>
                              ) : (
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center py-16">
                                  <Loader2
                                    className="animate-spin text-slate-600 mb-4"
                                    size={32}
                                  />
                                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    Evaluation in Progress
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-10 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">
                                Deployment Response
                              </label>
                              <textarea
                                placeholder="Architect your submission response here..."
                                className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white text-lg outline-none focus:border-[#d6ff00] transition-all resize-none h-60"
                                value={submissionForm.content}
                                onChange={(e) =>
                                  setSubmissionForm({
                                    ...submissionForm,
                                    content: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">
                                Supporting Evidence (File)
                              </label>
                              <div className="relative group">
                                <input
                                  type="file"
                                  className="hidden"
                                  id={`file-upload-${assignment._id}`}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const formData = new FormData();
                                    formData.append("file", file);

                                    try {
                                      const res = await fetch(
                                        `${API_URL}/upload`,
                                        {
                                          method: "POST",
                                          headers: {
                                            Authorization: `Bearer ${localStorage.getItem(
                                              "lms_token"
                                            )}`,
                                          },
                                          body: formData,
                                        }
                                      );
                                      const data = await res.json();
                                      if (data.success) {
                                        setSubmissionForm({
                                          ...submissionForm,
                                          fileUrl: data.url,
                                        });
                                      }
                                    } catch (err) {
                                      console.error("Upload failed:", err);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`file-upload-${assignment._id}`}
                                  className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#d6ff00]/30 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#d6ff00]">
                                      <Paperclip size={24} />
                                    </div>
                                    <div>
                                      <p className="font-black text-white">
                                        {submissionForm.fileUrl
                                          ? "Document Linked"
                                          : "Attach Evidence"}
                                      </p>
                                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                        {submissionForm.fileUrl
                                          ? submissionForm.fileUrl
                                              .split("/")
                                              .pop()
                                          : "Max size 10MB"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="h-10 px-6 rounded-xl bg-white/5 flex items-center text-[10px] font-black uppercase text-slate-300">
                                    Browse
                                  </div>
                                </label>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                handleAssignmentSubmit(assignment._id)
                              }
                              disabled={isSubmitting || !submissionForm.content}
                              className="group w-full rounded-[2rem] bg-[#d6ff00] py-6 text-sm font-black text-[#08120f] shadow-[0_20px_50px_rgba(214,255,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                            >
                              {isSubmitting
                                ? "TRANSMITTING DATA..."
                                : "COMMIT SUBMISSION"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {assignments.length === 0 && (
                    <div className="py-40 text-center space-y-8">
                      <FileText className="mx-auto text-slate-800" size={100} />
                      <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xl">
                        Operational Silence
                      </p>
                      <p className="text-slate-600 max-w-sm mx-auto">
                        No strategic evaluations have been deployed for this
                        sector yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PDF READER MODAL */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full h-[90vh] max-w-5xl rounded-[2.5rem] border border-white/10 bg-[#0d1610] p-1 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#08120f]/50 backdrop-blur-xl">
              <h3 className="text-lg font-black text-white tracking-tight truncate max-w-2xl">
                {activePdfTitle || "Supplemental Material"}
              </h3>
              <button
                onClick={() => {
                  setActivePdfUrl(null);
                  setActivePdfTitle(null);
                }}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 w-full bg-white/5">
              <iframe
                src={`${activePdfUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title={activePdfTitle || "PDF Reader"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
