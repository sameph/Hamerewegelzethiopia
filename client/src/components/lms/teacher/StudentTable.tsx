"use client";

import { useEffect, useState } from "react";
import { User, Users, MessageCircle, BarChart, FileText } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Student {
  _id: string;
  username: string;
  email: string;
  program?: string;
  department?: string;
  profileImage?: string;
  studentId?: string;
  batch?: string;
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/courses/my-courses`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
        });
        const data = await res.json();
        if (data.success) setCourses(data.data);
      } catch (err) { console.error("Failed to fetch courses:", err); }
    };

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const url = selectedCourse 
          ? `${API_URL}/users/my-students?courseId=${selectedCourse}`
          : `${API_URL}/users/my-students`;
          
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchStudents();
  }, [selectedCourse]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Students</h2>
            <p className="text-sm text-slate-400 mt-1">Manage and track performance of students enrolled in your courses.</p>
          </div>
          <div className="flex gap-4">
             <select 
               value={selectedCourse}
               onChange={(e) => setSelectedCourse(e.target.value)}
               className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 border border-white/10 outline-none focus:border-mint transition-all"
             >
               <option value="">All Courses</option>
               {courses.map(c => (
                 <option key={c._id} value={c._id}>{c.title}</option>
               ))}
             </select>
             <span className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 border border-white/10">
                Total: {students.length}
             </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-slate-500 border-b border-white/5">
                  <th className="px-6 py-5 font-black">Student</th>
                  <th className="px-6 py-5 font-black">Email</th>
                  <th className="px-6 py-5 font-black">Program</th>
                  <th className="px-6 py-5 font-black">Progress</th>
                  <th className="px-6 py-5 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-white/5 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No students enrolled yet.</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="group hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mint/20 to-blue-500/20 flex items-center justify-center border border-white/10 text-lg">
                            {student.profileImage || "👨‍🎓"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white group-hover:text-mint transition-colors">{student.username}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{student.studentId || "No ID"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-400 font-medium">{student.email}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-slate-300 w-fit">
                            {student.program || "General Theology"}
                          </span>
                          <span className="text-[9px] text-slate-500 ml-1">{student.batch || "2024 Batch"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-mint rounded-full" style={{ width: '0%' }}></div>
                           </div>
                           <span className="text-[10px] font-bold text-mint">0%</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button title="View Profile" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                              <User size={16} />
                           </button>
                           <a 
                              href={`/lms/dashboard/teacher/messages?recipient=${student._id}`}
                              title="Message" 
                              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-mint hover:bg-white/10 transition-all"
                           >
                              <MessageCircle size={16} />
                           </a>
                           <button title="Analytics" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-white/10 transition-all">
                              <BarChart size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-xl">
           <h3 className="text-xl font-bold text-white mb-6">Performance Insights</h3>
           <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">Average Grade</span>
                    <span className="text-xl font-black text-mint">B+</span>
                 </div>
                 <p className="text-xs text-slate-400">Based on recent assignments and quizzes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">Attendance Rate</span>
                    <span className="text-xl font-black text-blue-400">92%</span>
                 </div>
                 <p className="text-xs text-slate-400">Average across all current batches.</p>
              </div>
           </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-xl">
           <h3 className="text-xl font-bold text-white mb-6">Exports & Reports</h3>
           <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#d6ff00]/10 hover:border-[#d6ff00]/30 transition-all group">
                 <FileText className="text-slate-400 group-hover:text-mint" size={32} />
                 <span className="text-xs font-bold text-slate-300">Class Report</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#d6ff00]/10 hover:border-[#d6ff00]/30 transition-all group">
                 <Users className="text-slate-400 group-hover:text-mint" size={32} />
                 <span className="text-xs font-bold text-slate-300">Student Export</span>
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
