"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  Plus, 
  BookOpen, 
  Video, 
  FileText, 
  Paperclip, 
  Trash2, 
  Edit3, 
  ChevronLeft,
  ChevronRight, 
  ChevronDown, 
  Youtube, 
  Upload,
  Settings,
  FolderPlus,
  Users,
  CheckCircle2,
  X,
  Calendar,
  Clock,
  BarChart,
  MoreVertical
} from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  enrolledStudents?: string[];
  thumbnail?: string;
}

interface Chapter {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  status: 'draft' | 'published';
  order: number;
}

interface Lesson {
  _id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  type: 'video' | 'document' | 'reading' | 'material';
  materials?: Array<{ name: string; url: string; fileType: string }>;
  duration?: string;
  status: 'draft' | 'published';
  order: number;
  chapter?: string;
}

interface Assignment {
  _id: string;
  title: string;
  instructions?: string;
  dueDate: string;
  status: 'draft' | 'published';
  attachments?: Array<{ name: string; url: string; fileType: string }>;
  course: string;
}

export default function CourseManager() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Chapter & Lesson State
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  
  // Selection for edit
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [targetChapterId, setTargetChapterId] = useState<string | null>(null);

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({ 
    title: "", 
    instructions: "", 
    dueDate: "", 
    status: "draft" as Assignment['status'],
    attachments: [] as Assignment['attachments']
  });

  // Analytics
  const [courseAnalytics, setCourseAnalytics] = useState<any>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Form Data
  const [courseForm, setCourseForm] = useState({ title: "", description: "", category: "Theology", difficulty: "Beginner" });
  const [chapterForm, setChapterForm] = useState({ title: "", description: "", duration: 0, order: 1, status: "draft" as Chapter['status'] });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    type: "video" as Lesson['type'],
    duration: "",
    order: 1,
    status: "draft" as Lesson['status'],
    materials: [] as Lesson['materials']
  });

  const [formLoading, setFormLoading] = useState(false);

  const fetchCourses = async () => {
    const userId = user?._id || (user as any)?.id;
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses?instructor=${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) setCourses(data.data);
    } catch (err) {
      console.error("Fetch courses err:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseData = async (courseId: string) => {
    try {
      // Fetch Chapters
      const cRes = await fetch(`${API_URL}/chapters/course/${courseId}`);
      const cData = await cRes.json();
      if (cData.success) setChapters(cData.data);

      const lRes = await fetch(`${API_URL}/courses/${courseId}/lessons`);
      const lData = await lRes.json();
      if (lData.success) setLessons(lData.data || []);

      // Fetch Assignments
      const aRes = await fetch(`${API_URL}/assignments/course/${courseId}`);
      const aData = await aRes.json();
      if (aData.success) setAssignments(aData.data);

      // Fetch Analytics if instructor
      const anRes = await fetch(`${API_URL}/courses/${courseId}/analytics`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const anData = await anRes.json();
      if (anData.success) setCourseAnalytics(anData.data);
    } catch (err) {
      console.error("Fetch course data err:", err);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        return { name: data.data.name, url: data.data.url, fileType: data.data.fileType };
      }
    } catch (err) { console.error("File upload failed:", err); }
    return null;
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setFormLoading(true);
    try {
      const url = editingAssignment 
        ? `${API_URL}/assignments/${editingAssignment._id}`
        : `${API_URL}/assignments`;
      
      const payload = {
        ...assignmentForm,
        course: selectedCourse._id,
        // Ensure dueDate is valid ISO string if it's just a date string from input
        dueDate: new Date(assignmentForm.dueDate).toISOString()
      };

      const res = await fetch(url, {
        method: editingAssignment ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsAssignmentModalOpen(false);
        fetchCourseData(selectedCourse._id);
      } else {
        alert("Deployment failed: " + data.message);
      }
    } catch (err) { 
      console.error(err);
      alert("An error occurred during deployment.");
    }
    setFormLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseData(selectedCourse._id);
    }
  }, [selectedCourse]);

  const toggleChapter = (id: string) => {
    const next = new Set(expandedChapters);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedChapters(next);
  };

  // Course Handlers
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const url = editingCourse ? `${API_URL}/courses/${editingCourse._id}` : `${API_URL}/courses`;
      const res = await fetch(url, {
        method: editingCourse ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` },
        body: JSON.stringify(courseForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsCourseModalOpen(false);
        fetchCourses();
      }
    } catch (err) { console.error(err); }
    setFormLoading(false);
  };

  // Chapter Handlers
  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setFormLoading(true);
    try {
      const url = editingChapter 
        ? `${API_URL}/chapters/${editingChapter._id}`
        : `${API_URL}/chapters`;
      
      const res = await fetch(url, {
        method: editingChapter ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` },
        body: JSON.stringify({ ...chapterForm, course: selectedCourse._id })
      });
      if ((await res.json()).success) {
        setIsChapterModalOpen(false);
        fetchCourseData(selectedCourse._id);
      }
    } catch (err) { console.error(err); }
    setFormLoading(false);
  };

  // Lesson Handlers
  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setFormLoading(true);
    try {
      const payload = { ...lessonForm, chapter: targetChapterId };
      
      const url = editingLesson
        ? `${API_URL}/lessons/${editingLesson._id}`
        : `${API_URL}/courses/${selectedCourse?._id}/lessons`;
      
      const res = await fetch(url, {
        method: editingLesson ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` },
        body: JSON.stringify(payload)
      });
      if ((await res.json()).success) {
        setIsLessonModalOpen(false);
        fetchCourseData(selectedCourse?._id);
      }
    } catch (err) { console.error(err); }
    setFormLoading(false);
  };

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const addMaterialField = () => {
    setLessonForm({
      ...lessonForm,
      materials: [...(lessonForm.materials || []), { name: "", url: "", fileType: "pdf" }]
    });
  };

  const removeMaterialField = (index: number) => {
    const next = [...(lessonForm.materials || [])];
    next.splice(index, 1);
    setLessonForm({ ...lessonForm, materials: next });
  };

  const handleUploadMaterial = async (file: File) => {
    toast.loading("Uploading school resource...", { id: "pdf-upload" });
    const uploaded = await handleFileUpload(file);
    if (uploaded) {
      const next = [...(lessonForm.materials || []), { name: uploaded.name, url: uploaded.url, fileType: "pdf" }];
      setLessonForm({ ...lessonForm, materials: next });
      toast.success("Resource uploaded successfully!", { id: "pdf-upload" });
    } else {
      toast.error("Failed to upload resource", { id: "pdf-upload" });
    }
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-screen pb-20">
      {!selectedCourse ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#0d1610] to-[#08120f] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-[10px] font-black uppercase tracking-[0.2em] text-mint">Instructor Terminal</div>
                  <div className="h-1 w-1 rounded-full bg-slate-700" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{courses.length} Active Modules</div>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">Curriculum <span className="text-mint">Architect.</span></h1>
                <p className="mt-4 max-w-xl text-lg text-slate-400 font-medium leading-relaxed">Design, manage, and evolve your educational masterpieces with surgical precision.</p>
              </div>
              <button 
                onClick={() => { setEditingCourse(null); setCourseForm({ title: '', description: '', category: 'Theology', difficulty: 'Beginner' }); setIsCourseModalOpen(true); }}
                className="group flex items-center gap-3 rounded-2xl bg-mint px-8 py-5 text-sm font-black text-[#08120f] shadow-[0_20px_50px_rgba(214,255,0,0.2)] hover:scale-[1.05] active:scale-95 transition-all duration-500"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                Initialize New Course
              </button>
            </div>
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-mint/5 blur-[120px]" />
          </section>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[400px] animate-pulse rounded-[2.5rem] bg-white/5 border border-white/10" />
              ))
            ) : courses.map(course => (
              <div key={course._id} className="group relative rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-1 hover:border-mint/30 hover:bg-white/[0.05] transition-all duration-500">
                <div className="relative h-56 w-full overflow-hidden rounded-[2rem]">
                   <img src={course.thumbnail || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80"} className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#08120f] via-transparent to-transparent opacity-60" />
                   <div className="absolute top-6 left-6">
                     <span className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 text-[10px] font-black uppercase text-white shadow-xl">{course.category}</span>
                   </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-mint transition-colors line-clamp-1">{course.title}</h3>
                  <p className="mt-3 text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">{course.description}</p>
                  
                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 group-hover:text-mint group-hover:bg-mint/10 transition-all">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Enrolled</p>
                        <p className="text-sm font-bold text-white">{course.enrolledStudents?.length || 0} Students</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingCourse(course); setCourseForm({ title: course.title, description: course.description, category: course.category, difficulty: course.difficulty }); setIsCourseModalOpen(true); }}
                        className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="flex items-center gap-2 rounded-xl bg-mint px-6 py-3 text-[11px] font-black text-[#08120f] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(214,255,0,0.1)]"
                      >
                        Curriculum
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <header className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#0d1610] to-[#08120f] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="group flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/5 text-white hover:bg-mint hover:text-[#08120f] transition-all duration-500 border border-white/10 shadow-xl"
              >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                   <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Architecture Mode</div>
                   <div className="h-1 w-1 rounded-full bg-slate-700" />
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{chapters.length} Active Chapters</div>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">{selectedCourse.title}</h2>
                <p className="mt-4 max-w-4xl text-lg text-slate-400 font-medium leading-relaxed">{selectedCourse.description}</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setIsAnalyticsOpen(true)}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-8 py-4 text-[11px] font-black text-white border border-white/10 hover:bg-white/20 transition-all duration-500 uppercase tracking-widest"
                >
                  <BarChart size={18} /> View Analytics
                </button>
                <button 
                  onClick={() => { setEditingChapter(null); setChapterForm({ title: "", description: "", duration: 0, order: chapters.length + 1, status: 'draft' }); setIsChapterModalOpen(true); }}
                  className="flex items-center gap-3 rounded-2xl bg-mint px-8 py-4 text-[11px] font-black text-[#08120f] shadow-[0_20px_50px_rgba(214,255,0,0.2)] hover:scale-[1.05] transition-all duration-500 uppercase tracking-widest"
                >
                  <FolderPlus size={18} /> Deploy Chapter
                </button>
                <button 
                  onClick={() => { setEditingAssignment(null); setAssignmentForm({ title: "", instructions: "", dueDate: "", status: 'draft', attachments: [] }); setIsAssignmentModalOpen(true); }}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-8 py-4 text-[11px] font-black text-white border border-white/10 hover:bg-white/20 transition-all duration-500 uppercase tracking-widest"
                >
                  <Plus size={18} /> Deploy Assignment
                </button>
              </div>
            </div>
            <div className="absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-mint/5 blur-[120px]" />
          </header>

          {/* Curriculum Workspace */}
          <div className="grid gap-10 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-12">
               <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                   <h3 className="text-2xl font-black text-white tracking-tight uppercase">Strategic Content</h3>
                 </div>
                 
                 <div className="space-y-4">
                   {chapters.sort((a,b) => a.order - b.order).map(chapter => (
                     <div key={chapter._id} className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.05] hover:border-mint/30 transition-all duration-300">
                       <div 
                         onClick={() => toggleChapter(chapter._id)}
                         className="flex cursor-pointer items-center justify-between p-8 hover:bg-white/[0.05] transition-all"
                       >
                         <div className="flex items-center gap-6">
                           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint border border-mint/20 shadow-[0_0_15px_rgba(214,255,0,0.1)]">
                             {expandedChapters.has(chapter._id) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                           </div>
                           <div>
                             <h4 className="text-xl font-black text-white tracking-tight">{chapter.title}</h4>
                             <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mt-1 flex items-center gap-2">
                                <BookOpen size={12} className="text-mint" />
                                {lessons.filter(l => l.chapter === chapter._id).length} Lessons Defined
                             </p>
                           </div>
                         </div>
                         <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setTargetChapterId(chapter._id); setEditingLesson(null); setLessonForm({ title: "", content: "", videoUrl: "", type: "video", duration: "", order: lessons.filter(l => l.chapter === chapter._id).length + 1, materials: [], status: 'draft' }); setIsLessonModalOpen(true); }}
                              className="flex items-center gap-2 rounded-xl bg-[#d6ff00] px-4 py-2 text-xs font-black text-[#08120f] hover:scale-[1.02] transition-all"
                            >
                              <Plus size={14} /> Add Lesson
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingChapter(chapter); setChapterForm({ title: chapter.title, description: chapter.description || "", duration: chapter.duration || 0, order: chapter.order, status: chapter.status as any }); setIsChapterModalOpen(true); }}
                              className="p-2 text-slate-500 hover:text-white"
                            >
                              <Edit3 size={18} />
                            </button>
                         </div>
                       </div>

                       {expandedChapters.has(chapter._id) && (
                         <div className="space-y-3 p-6 pt-0 border-t border-white/10 animate-in slide-in-from-top-4 duration-300">
                           {lessons.filter(l => l.chapter === chapter._id).sort((a,b) => a.order - b.order).map(lesson => (
                             <div key={lesson._id} className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-5 border border-white/5 hover:border-mint/40 hover:bg-white/[0.07] transition-all group shadow-sm">
                               <div className="flex items-center gap-5">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-mint/20 group-hover:text-mint transition-all border border-white/5 group-hover:border-mint/30 shadow-inner">
                                     {lesson.type === 'video' ? <Youtube size={20} /> : lesson.type === 'material' ? <Paperclip size={20} /> : <FileText size={20} />}
                                  </div>
                                   <div>
                                     <div className="flex items-center gap-3">
                                        <p className="font-black text-base text-white group-hover:text-mint transition-colors">{lesson.title}</p>
                                        <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${lesson.status === 'published' ? 'bg-mint/20 text-mint border border-mint/30' : 'bg-slate-500/20 text-slate-500 border border-slate-500/30'}`}>
                                           {lesson.status}
                                        </span>
                                     </div>
                                     <div className="flex items-center gap-4 mt-1">
                                        <span className="text-[10px] font-black uppercase text-mint/60 tracking-widest">{lesson.type}</span>
                                        {lesson.duration && <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold"><Clock size={12} /> {lesson.duration}</span>}
                                        {lesson.materials && lesson.materials.length > 0 && (
                                          <span className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20"><Paperclip size={12} /> {lesson.materials.length} Materials</span>
                                        )}
                                     </div>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <button 
                                    onClick={() => { setEditingLesson(lesson); setTargetChapterId(chapter._id); setLessonForm({ title: lesson.title, content: lesson.content || "", videoUrl: lesson.videoUrl || "", type: lesson.type as any, duration: lesson.duration || "", order: lesson.order, materials: (lesson as any).materials || [], status: lesson.status as any }); setIsLessonModalOpen(true); }}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                  >
                                    <Edit3 size={18} />
                                  </button>
                                  <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all"><Trash2 size={18} /></button>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               </div>

               {/* Assignments Section */}
               <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                   <h3 className="text-2xl font-black text-white tracking-tight uppercase">Course Assignments</h3>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{assignments.length} Total Assignments</span>
                 </div>

                 <div className="grid gap-4">
                   {assignments.map(assignment => (
                     <div key={assignment._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-mint/30 transition-all">
                       <div className="flex items-start justify-between">
                         <div>
                           <h4 className="text-lg font-bold text-white">{assignment.title}</h4>
                           <p className="text-sm text-slate-400 mt-1">{assignment.instructions}</p>
                           <div className="flex items-center gap-4 mt-4">
                             <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                               <Clock size={12} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                             </span>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <button 
                             onClick={() => { setEditingAssignment(assignment); setAssignmentForm({ title: assignment.title, instructions: assignment.instructions || "", dueDate: new Date(assignment.dueDate).toISOString().split('T')[0], status: assignment.status as any, attachments: (assignment as any).attachments || [] }); setIsAssignmentModalOpen(true); }}
                             className="p-2 text-slate-500 hover:text-white"
                           >
                             <Edit3 size={18} />
                           </button>
                           <button className="p-2 text-red-500/50 hover:text-red-500">
                             <Trash2 size={18} />
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                   {assignments.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-10 rounded-[2.5rem] border border-dashed border-white/10 bg-white/5">
                       <p className="text-sm text-slate-500">No assignments posted yet.</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>

            <aside className="space-y-6">
               <div className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Course Metrics</h3>
                  <div className="grid gap-4">
                     <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Live Students</p>
                        <p className="text-3xl font-black text-white mt-1">{selectedCourse?.enrolledStudents?.length || 0}</p>
                     </div>
                     <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Total Chapters</p>
                        <p className="text-3xl font-black text-white mt-1">{chapters.length}</p>
                     </div>
                  </div>
               </div>

               <div className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Controls</h3>
                  <div className="space-y-2">
                     <button className="w-full flex items-center gap-3 rounded-2xl bg-white/5 px-5 py-4 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        <Settings size={18} /> Course Settings
                     </button>
                     <button className="w-full flex items-center gap-3 rounded-2xl bg-red-500/10 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all">
                        <Trash2 size={18} /> Archive Course
                     </button>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      )}

      {/* Modals */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#08120f]/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-xl rounded-[3rem] border border-white/20 bg-[#111f16] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <h3 className="text-3xl font-black text-white tracking-tighter">{editingChapter ? "Modify Chapter" : "New Curriculum Chapter"}</h3>
              <form onSubmit={handleChapterSubmit} className="mt-10 space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Chapter Identity</label>
                    <input 
                       required
                       value={chapterForm.title}
                       onChange={(e) => setChapterForm({...chapterForm, title: e.target.value})}
                       className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.07] py-5 px-6 text-sm text-white placeholder-slate-600 outline-none focus:border-mint focus:bg-white/[0.12] transition-all"
                       placeholder="e.g. Fundamental Principles of Theology"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Estimated Duration (Minutes)</label>
                    <input 
                       required
                       type="number"
                       value={chapterForm.duration}
                       onChange={(e) => setChapterForm({...chapterForm, duration: parseInt(e.target.value) || 0})}
                       className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.07] py-5 px-6 text-sm text-white placeholder-slate-600 outline-none focus:border-mint focus:bg-white/[0.12] transition-all"
                       placeholder="e.g. 120"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Publication Status</label>
                    <div className="flex p-1 bg-white/5 rounded-2xl w-max">
                       <button 
                         type="button" 
                         onClick={() => setChapterForm({...chapterForm, status: 'draft'})}
                         className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chapterForm.status === 'draft' ? 'bg-slate-500 text-white' : 'text-slate-500'}`}
                       >Draft</button>
                       <button 
                         type="button" 
                         onClick={() => setChapterForm({...chapterForm, status: 'published'})}
                         className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chapterForm.status === 'published' ? 'bg-mint text-[#08120f]' : 'text-slate-500'}`}
                       >Published</button>
                    </div>
                 </div>
                 <div className="flex gap-6 pt-4">
                     <button type="button" onClick={() => setIsChapterModalOpen(false)} className="flex-1 py-5 text-sm font-black text-slate-500 hover:text-white transition-colors">Dismiss</button>
                     <button type="submit" className="flex-[2] rounded-2xl bg-mint py-5 text-sm font-black text-[#08120f] shadow-lg shadow-mint/10 hover:scale-[1.02] active:scale-95 transition-all">{editingChapter ? "Update Chapter" : "Initialize Chapter"}</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isLessonModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl rounded-[3rem] border border-white/10 bg-[#0d1610] p-12 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-2xl font-black text-white">Assemble Lesson</h3>
              <form onSubmit={handleLessonSubmit} className="mt-10 space-y-8">
                 <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Lesson Name</label>
                       <input 
                          required
                          value={lessonForm.title}
                          onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm outline-none focus:border-[#d6ff00] transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Primary Type</label>
                       <select 
                          value={lessonForm.type}
                          onChange={(e) => setLessonForm({...lessonForm, type: e.target.value as any})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm outline-none focus:border-[#d6ff00] transition-all appearance-none"
                       >
                          <option value="video">Video Lecture</option>
                          <option value="reading">Text-based Reading</option>
                          <option value="document">Interactive Document</option>
                          <option value="material">Supplemental Resource</option>
                       </select>
                    </div>
                 </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Publication Status</label>
                     <div className="flex p-1 bg-white/5 rounded-2xl w-max">
                        <button 
                          type="button" 
                          onClick={() => setLessonForm({...lessonForm, status: 'draft'})}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lessonForm.status === 'draft' ? 'bg-slate-500 text-white' : 'text-slate-500'}`}
                        >Draft</button>
                        <button 
                          type="button" 
                          onClick={() => setLessonForm({...lessonForm, status: 'published'})}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lessonForm.status === 'published' ? 'bg-mint text-[#08120f]' : 'text-slate-500'}`}
                        >Published</button>
                     </div>
                  </div>

                 {lessonForm.type === 'video' && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">YouTube Video URL</label>
                          <div className="relative">
                             <Youtube className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${extractYoutubeId(lessonForm.videoUrl) ? 'text-red-500' : 'text-slate-600'}`} size={18} />
                             <input 
                                value={lessonForm.videoUrl}
                                onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                                className={`pl-14 w-full rounded-2xl border bg-white/5 py-4 px-5 text-sm outline-none transition-all ${
                                  !lessonForm.videoUrl 
                                    ? 'border-white/10' 
                                    : extractYoutubeId(lessonForm.videoUrl) 
                                      ? 'border-mint/50 focus:border-mint' 
                                      : 'border-red-500/50 focus:border-red-500'
                                }`}
                                placeholder="https://youtube.com/watch?v=..."
                             />
                             {lessonForm.videoUrl && (
                               <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                 {extractYoutubeId(lessonForm.videoUrl) ? (
                                   <CheckCircle2 size={16} className="text-mint animate-in zoom-in" />
                                 ) : (
                                   <X size={16} className="text-red-500 animate-in zoom-in" />
                                 )}
                               </div>
                             )}
                          </div>
                       </div>

                       {extractYoutubeId(lessonForm.videoUrl) && (
                         <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl animate-in zoom-in-95 duration-500">
                           <iframe 
                             src={`https://www.youtube.com/embed/${extractYoutubeId(lessonForm.videoUrl)}`}
                             className="absolute inset-0 h-full w-full"
                             allowFullScreen
                             title="Video Preview"
                           />
                         </div>
                       )}
                    </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Attach Materials (PDF/PPT/Docs)</label>
                    <div className="space-y-3">
                       {lessonForm.materials?.map((m, idx) => (
                         <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-left-2">
                            <input 
                              placeholder="Name e.g. Syllabus.pdf"
                              value={m.name}
                              onChange={(e) => {
                                const next = [...lessonForm.materials!];
                                next[idx].name = e.target.value;
                                setLessonForm({...lessonForm, materials: next});
                              }}
                              className="flex-[2] rounded-xl border border-white/5 bg-white/5 py-2 px-3 text-xs outline-none focus:border-[#d6ff00]"
                            />
                            <input 
                              placeholder="URL to Cloud File"
                              value={m.url}
                              onChange={(e) => {
                                const next = [...lessonForm.materials!];
                                next[idx].url = e.target.value;
                                setLessonForm({...lessonForm, materials: next});
                              }}
                              className="flex-[3] rounded-xl border border-white/5 bg-white/5 py-2 px-3 text-xs outline-none focus:border-[#d6ff00]"
                            />
                            <button type="button" onClick={() => removeMaterialField(idx)} className="text-red-500 p-1 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                         </div>
                       ))}
                        <div className="flex gap-2 w-full">
                          <button 
                            type="button" 
                            onClick={addMaterialField}
                            className="flex-1 flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:border-[#d6ff00] hover:text-[#d6ff00] transition-all justify-center"
                          >
                            <Plus size={14} /> Link Material
                          </button>
                          
                          <label className="flex-1 flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:border-[#d6ff00] hover:text-[#d6ff00] transition-all cursor-pointer justify-center">
                            <Upload size={14} /> Upload PDF Resource
                            <input 
                              type="file" 
                              accept=".pdf"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  await handleUploadMaterial(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Content / Transcript</label>
                    <textarea 
                       rows={5}
                       value={lessonForm.content}
                       onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                       className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm outline-none focus:border-[#d6ff00] transition-all resize-none"
                    />
                 </div>

                 <div className="flex gap-6">
                    <button type="button" onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-500">Discard</button>
                    <button type="submit" disabled={formLoading} className="flex-[2] rounded-2xl bg-[#d6ff00] py-4 text-sm font-black text-[#08120f] shadow-xl shadow-[#d6ff00]/10">
                      {formLoading ? "Processing..." : "Commit Lesson"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#08120f]/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-xl rounded-[3rem] border border-white/20 bg-[#111f16] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <h3 className="text-3xl font-black text-white tracking-tighter">{editingAssignment ? "Modify Assignment" : "New Strategic Assignment"}</h3>
             <form onSubmit={handleAssignmentSubmit} className="mt-10 space-y-8">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Assignment Title</label>
                    <input 
                       required
                       value={assignmentForm.title}
                       onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                       className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.07] py-5 px-6 text-sm text-white placeholder-slate-600 outline-none focus:border-mint focus:bg-white/[0.12] transition-all"
                       placeholder="e.g. Theological Analysis Paper"
                    />
                 </div>

                 <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Publication Status</label>
                       <div className="flex p-1 bg-white/5 rounded-2xl w-max">
                          <button 
                            type="button" 
                            onClick={() => setAssignmentForm({...assignmentForm, status: 'draft'})}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${assignmentForm.status === 'draft' ? 'bg-slate-500 text-white' : 'text-slate-500'}`}
                          >Draft</button>
                          <button 
                            type="button" 
                            onClick={() => setAssignmentForm({...assignmentForm, status: 'published'})}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${assignmentForm.status === 'published' ? 'bg-mint text-[#08120f]' : 'text-slate-500'}`}
                          >Published</button>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Submission Deadline</label>
                       <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                          <input 
                             required
                             type="date"
                             value={assignmentForm.dueDate}
                             onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                             className="w-full rounded-2xl border border-white/10 bg-white/[0.07] py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-mint transition-all [color-scheme:dark]"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Instructions (Rich Text Option 1)</label>
                    </div>
                    <textarea 
                       value={assignmentForm.instructions}
                       onChange={(e) => setAssignmentForm({...assignmentForm, instructions: e.target.value})}
                       rows={4}
                       className="w-full rounded-2xl border border-white/10 bg-white/[0.07] py-5 px-6 text-sm text-white placeholder-slate-600 outline-none focus:border-mint transition-all resize-none"
                       placeholder="Draft detailed pedagogical instructions..."
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Supporting Documents (Direct Upload)</label>
                    <div className="space-y-4">
                       <input 
                         type="file"
                         onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const uploaded = await handleFileUpload(e.target.files[0]);
                              if (uploaded) {
                                setAssignmentForm(prev => ({
                                  ...prev,
                                  attachments: [...(prev.attachments || []), uploaded]
                                }));
                              }
                            }
                         }}
                         className="hidden"
                         id="assignment-file-upload"
                       />
                       <label 
                         htmlFor="assignment-file-upload"
                         className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl border-2 border-dashed border-white/10 text-xs font-black uppercase text-slate-500 hover:border-mint hover:text-mint hover:bg-mint/5 transition-all cursor-pointer group"
                       >
                          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                          Upload Scholarly Asset
                       </label>

                       <div className="grid gap-3">
                          {assignmentForm.attachments?.map((a, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group">
                               <div className="flex items-center gap-3">
                                  <Paperclip size={14} className="text-mint" />
                                  <span className="text-[10px] font-bold text-white truncate max-w-[200px]">{a.name}</span>
                               </div>
                               <button 
                                 type="button" 
                                 onClick={() => {
                                   const next = [...assignmentForm.attachments!];
                                   next.splice(idx, 1);
                                   setAssignmentForm({...assignmentForm, attachments: next});
                                 }} 
                                 className="text-red-500 hover:scale-110 transition-transform"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-6 pt-4">
                     <button type="button" onClick={() => setIsAssignmentModalOpen(false)} className="flex-1 py-5 text-sm font-black text-slate-500 hover:text-white transition-colors">Dismiss</button>
                     <button type="submit" disabled={formLoading} className="flex-[2] rounded-2xl bg-mint py-5 text-sm font-black text-[#08120f] shadow-lg shadow-mint/10 hover:scale-[1.02] active:scale-95 transition-all">
                        {formLoading ? "Processing..." : (editingAssignment ? "Update Deployment" : "Deploy Assignment")}
                     </button>
                 </div>
              </form>
           </div>
        </div>
      )}
      {/* Analytics Modal */}
      {isAnalyticsOpen && courseAnalytics && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#08120f]/90 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="w-full max-w-4xl rounded-[3.5rem] border border-white/10 bg-[#0d1610] p-10 lg:p-16 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Operational Analytics</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Course Performance & Student Metrics</p>
                 </div>
                 <button onClick={() => setIsAnalyticsOpen(false)} className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-12">
                 <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Enrollment</p>
                    <p className="text-4xl font-black text-white">{courseAnalytics.totalEnrolled}</p>
                 </div>
                 <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Avg. Progress</p>
                    <p className="text-4xl font-black text-mint">{Math.round(courseAnalytics.averageProgress)}%</p>
                 </div>
                 <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Completion</p>
                    <p className="text-4xl font-black text-blue-400">{Math.round(courseAnalytics.completionRate)}%</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest px-2">Student Register ({courseAnalytics.studentProgress.length})</h4>
                 <div className="space-y-3">
                    {courseAnalytics.studentProgress.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white font-black">{p.student.username[0]}</div>
                            <div>
                               <p className="font-bold text-white">{p.student.username}</p>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{p.student.email}</p>
                            </div>
                         </div>
                         <div className="text-right space-y-1">
                            <p className="text-sm font-black text-white">{p.percentComplete}%</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">{p.completedCount} / {p.totalLessons} Lessons</p>
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                               <div className="h-full bg-mint transition-all duration-1000" style={{ width: `${p.percentComplete}%` }} />
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
