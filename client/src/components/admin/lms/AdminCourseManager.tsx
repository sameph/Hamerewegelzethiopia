"use client";

import { useEffect, useState } from "react";
import { Plus, Search, BookOpen, User, Edit2, Trash2, CheckCircle, Clock } from "lucide-react";

interface Teacher {
  _id: string;
  username: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructor: Teacher;
  price: number;
  currency: string;
  createdAt: string;
}

export default function AdminCourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Theology",
    instructor: "",
    price: 0,
    currency: "USD"
  });

  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/courses`);
      const data = await res.json();
      if (data.success) setCourses(data.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/users?role=instructor`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) setTeachers(data.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchTeachers()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({ title: "", description: "", category: "Theology", instructor: "", price: 0, currency: "USD" });
    setModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category || "Theology",
      instructor: course.instructor?._id || "",
      price: course.price || 0,
      currency: course.currency || "USD"
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingCourse 
        ? `${process.env.NEXT_PUBLIC_API_URL || ""}/courses/${editingCourse._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || ""}/courses`;
      
      const method = editingCourse ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('lms_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        await fetchCourses();
        setModalOpen(false);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Course save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this course? All lessons will remain but orphan.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/courses/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setCourses(courses.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error("Delete course error:", err);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.instructor?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[300px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search courses or teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6ff00]"
          />
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-2xl bg-[#d6ff00] px-6 py-3 text-sm font-bold text-[#112014] shadow-sm hover:scale-[1.02] transition-all"
        >
          <Plus size={18} /> New Course
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-slate-100" />
          ))
        ) : filteredCourses.length === 0 ? (
           <div className="col-span-full py-20 text-center">
              <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium tracking-tight">No courses found matching your criteria.</p>
           </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course._id} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-[#d6ff00] hover:shadow-xl">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-[#f4faf5] text-[#24573c]">
                  <BookOpen size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(course)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(course._id)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-[#163325] leading-tight group-hover:text-blue-700 transition-colors">{course.title}</h3>
                <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">{course.category || "Theology"}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Assigned Teacher</p>
                    <p className="text-sm font-bold text-[#1c3326]">{course.instructor?.username || "Not Assigned"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#183625]">{editingCourse ? "Modify Course" : "Assemble New Course"}</h3>
            <p className="text-sm text-slate-500 mt-1">Define the curriculum and assign a dedicated instructor.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    placeholder="e.g. Intro to Hermeneutics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all appearance-none"
                  >
                    <option value="Theology">Theology</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Biblical Studies">Biblical Studies</option>
                    <option value="Church History">Church History</option>
                    <option value="Ministry">Ministry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Instructor</label>
                <div className="relative">
                   <select
                    required
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.username} ({t.email})</option>)}
                  </select>
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all appearance-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ETB">ETB (Br)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Syllabus / Short Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all resize-none"
                  placeholder="Outline the course objectives and requirements..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button 
                  disabled={saving}
                  type="submit"
                  className="flex-[2] rounded-2xl bg-[#d6ff00] py-4 text-sm font-black text-[#112014] shadow-lg shadow-[#d6ff00]/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? "Processing..." : editingCourse ? "Update Course" : "Commit Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
