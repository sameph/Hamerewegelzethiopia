"use client";

import { useEffect, useState } from "react";
import { Plus, Clock, FileText, CheckCircle, AlertCircle, Send } from "lucide-react";

interface Course {
  _id: string;
  title: string;
}

interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  course: string;
  description: string;
}

interface Submission {
  _id: string;
  assignment: string;
  student: {
    username: string;
    email: string;
  };
  submittedAt: string;
  status: string;
  grade?: string;
}

export default function AssignmentReview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    dueDate: "",
    courseId: "",
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses to populate assignment creation dropdown
        const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/courses?instructor=${localStorage.getItem('user_id')}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
        });
        const coursesData = await coursesRes.json();
        if (coursesData.success) {
          setCourses(coursesData.data);
          
          // Fetch assignments for the first course initially (as an example)
          if (coursesData.data.length > 0) {
             const assignRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/assignments/course/${coursesData.data[0]._id}`);
             const assignData = await assignRes.json();
             if (assignData.success) setAssignments(assignData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch assignment data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.courseId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('lms_token')}`
        },
        body: JSON.stringify({
          title: newAssignment.title,
          dueDate: newAssignment.dueDate,
          course: newAssignment.courseId,
          description: newAssignment.description
        })
      });
      const data = await res.json();
      if (data.success) {
        setAssignments([...assignments, data.data]);
        setNewAssignment({ title: "", dueDate: "", courseId: "", description: "" });
        alert("Assignment published successfully!");
      }
    } catch (err) {
      console.error("Create assignment error:", err);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Create Assignment Form */}
      <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 rounded-2xl bg-mint/10 text-mint">
              <Plus size={24} />
           </div>
           <h2 className="text-2xl font-bold text-white tracking-tight">Post Assignment</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
               <input 
                 value={newAssignment.title}
                 onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                 className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white focus:border-mint/50 focus:outline-none transition-all" 
                 placeholder="e.g. Midterm Research Paper" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
               <input 
                 type="date"
                 value={newAssignment.dueDate}
                 onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                 className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white focus:border-mint/50 focus:outline-none transition-all" 
               />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assigned Course</label>
             <select 
               value={newAssignment.courseId}
               onChange={(e) => setNewAssignment({...newAssignment, courseId: e.target.value})}
               className="w-full rounded-2xl border border-white/10 bg-[#111f16] px-4 py-3.5 text-sm text-white focus:border-mint/50 focus:outline-none transition-all appearance-none"
             >
                <option value="">Select a course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
             </select>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Instructional Content</label>
             <textarea 
               value={newAssignment.description}
               onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
               className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white focus:border-mint/50 focus:outline-none transition-all" 
               rows={5} 
               placeholder="Describe the task, objectives, and any required resources..." 
             />
          </div>

          <button 
            onClick={handleCreateAssignment}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-mint py-4 text-sm font-black text-[#08120f] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(214,255,0,0.2)]"
          >
            Publish Assignment <Send size={18} />
          </button>
        </div>
      </section>

      {/* Review Submissions List */}
      <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-bold text-white tracking-tight">Submissions</h3>
           <span className="rounded-xl bg-orange-400/10 px-3 py-1 text-[10px] font-black text-orange-400 border border-orange-400/20 uppercase tracking-tighter">
              {submissions.length} Pending
           </span>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {assignments.length === 0 ? (
             <div className="py-20 text-center space-y-4">
                <FileText className="mx-auto text-slate-600" size={48} />
                <p className="text-slate-400 italic">No assignments posted yet</p>
             </div>
          ) : (
            assignments.map((item) => (
              <div key={item._id} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-white/10 hover:bg-white/[0.05]">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <h4 className="text-lg font-bold text-white tracking-tight">{item.title}</h4>
                       <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_8px_rgba(214,255,0,0.8)]" />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1.5"><CheckCircle size={14} /> 12 Reviewed</span>
                    </div>
                  </div>
                  <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black text-white uppercase hover:bg-mint hover:text-[#08120f] transition-all">
                    Review All
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-br from-[#1d3324] to-[#0d1f14] border border-white/5">
           <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-mint/10 text-mint">
                 <AlertCircle size={20} />
              </div>
              <div>
                 <p className="text-sm font-bold text-white">Grading Intelligence</p>
                 <p className="text-xs text-slate-400 mt-1">Our system has detected 3 submissions with high similarity. Review for academic integrity.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
