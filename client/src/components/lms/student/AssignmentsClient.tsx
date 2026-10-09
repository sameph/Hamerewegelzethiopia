"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, CheckCircle, Clock, Loader2, Paperclip, Eye } from "lucide-react";
import { useNotification } from "@/lib/useNotification";
import PDFViewerModal from "@/components/lms/PDFViewerModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type Assignment = {
  _id: string;
  title: string;
  instructions: string;
  dueDate: string;
  course: { _id: string; title: string };
  submissionStatus: "pending" | "submitted" | "reviewed";
  submission: null | {
    _id: string;
    content: string;
    fileUrl?: string;
    grade?: string;
    feedback?: string;
    submittedAt: string;
  };
};

export default function AssignmentsClient() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [submissionForm, setSubmissionForm] = useState({ content: "", fileUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewedPdf, setViewedPdf] = useState<{url: string, name: string} | null>(null);
  
  const { success, error } = useNotification();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('lms_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const res = await fetch(`${API_URL}/assignments/my`, { headers });
      const data = await res.json();
      
      if (data.success) {
        setAssignments(data.data);
      } else {
        error(data.message || "Failed to load assignments");
      }
    } catch (err) {
      console.error("Fetch assignments failed:", err);
      error("Fetch assignments failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (assignmentId: string, file: File) => {
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
        setSubmissionForm({ ...submissionForm, fileUrl: data.url });
        success("File uploaded successfully");
      } else {
        error("File upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      error("File upload failed");
    }
  };

  const handleAssignmentSubmit = async (assignmentId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}` 
        },
        body: JSON.stringify(submissionForm)
      });
      const data = await res.json();
      if (data.success) {
        success("Assignment submitted successfully!");
        setUploadingId(null);
        setSubmissionForm({ content: "", fileUrl: "" });
        fetchData(); // Reload assignments to update status
      } else {
        error(data.message || "Submit failed");
      }
    } catch (err) { 
      console.error("Submit failed:", err); 
      error("Submit failed");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#d6ff00]" size={48} />
      </div>
    );
  }

  const pendingAssignments = assignments.filter(a => a.submissionStatus === 'pending');
  const submittedAssignments = assignments.filter(a => a.submissionStatus !== 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Pending Assignments */}
      <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Active Assignments</h2>
          {pendingAssignments.length > 0 && (
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-black uppercase text-red-300 tracking-widest leading-none">
              {pendingAssignments.length} Due
            </span>
          )}
        </div>

        <div className="space-y-4">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment) => (
              <div key={assignment._id} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-[#d6ff00]/30 transition-all">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-black text-white text-lg tracking-tight">{assignment.title}</h3>
                    <p className="mt-1 text-[10px] font-black uppercase text-slate-500 tracking-widest">{assignment.course?.title}</p>
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed">{assignment.instructions}</p>
                    <div className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#d6ff00]">
                      <Clock size={14} />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                        setUploadingId(uploadingId === assignment._id ? null : assignment._id);
                        if (uploadingId !== assignment._id) {
                            setSubmissionForm({ content: "", fileUrl: "" });
                        }
                    }}
                    className="shrink-0 w-full md:w-auto rounded-xl bg-[#d6ff00] px-6 py-3 text-[10px] font-black uppercase text-[#08120f] hover:bg-[#c4eb00] hover:scale-[1.02] transition-all shadow-lg shadow-[#d6ff00]/10"
                  >
                    {uploadingId === assignment._id ? "Cancel Submission" : "Submit Assignment"}
                  </button>
                </div>

                {uploadingId === assignment._id && (
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-6 animate-in slide-in-from-top-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Your Answer</label>
                      <textarea
                        placeholder="Type your submission here..."
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-6 py-5 text-sm text-slate-100 placeholder-slate-600 focus:border-[#d6ff00] focus:ring-1 focus:ring-[#d6ff00] focus:outline-none transition-all resize-none"
                        rows={4}
                        value={submissionForm.content}
                        onChange={(e) => setSubmissionForm({...submissionForm, content: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Attachment (Optional)</label>
                       <div className="relative group">
                          <input 
                            type="file" 
                            className="hidden" 
                            id={`file-upload-assignments-${assignment._id}`}
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(assignment._id, e.target.files[0])}
                          />
                          <label 
                            htmlFor={`file-upload-assignments-${assignment._id}`}
                            className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/10 hover:border-[#d6ff00]/30 transition-all cursor-pointer"
                          >
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#d6ff00]">
                                   <Paperclip size={20} />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-white">{submissionForm.fileUrl ? "File Uploaded" : "Upload File"}</p>
                                   <p className="text-[9px] font-black uppercase text-slate-500 mt-0.5">{submissionForm.fileUrl ? "Click to change" : "PDF, doc, docx up to 25MB"}</p>
                                </div>
                             </div>
                             {submissionForm.fileUrl ? (
                                <div className="px-3 py-1 rounded bg-[#d6ff00]/20 text-[10px] font-black uppercase text-[#d6ff00]">Linked</div>
                             ) : (
                                <div className="px-3 py-1 rounded bg-white/5 text-[10px] font-black uppercase text-slate-400">Browse</div>
                             )}
                          </label>
                       </div>
                    </div>

                    <button 
                      onClick={() => handleAssignmentSubmit(assignment._id)}
                      disabled={isSubmitting || (!submissionForm.content && !submissionForm.fileUrl)}
                      className="w-full rounded-2xl bg-[#d6ff00] py-4 text-[11px] font-black uppercase text-[#08120f] shadow-xl shadow-[#d6ff00]/10 hover:scale-[1.01] hover:bg-[#c4eb00] transition-all disabled:opacity-30 disabled:hover:scale-100"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-500 mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">All Caught Up!</h3>
              <p className="text-sm text-slate-500 mt-1">You have no pending assignments due right now.</p>
            </div>
          )}
        </div>
      </div>

      {/* Submitted Assignments */}
      {submittedAssignments.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xl font-black text-white mb-6 uppercase italic tracking-tight">Past Submissions</h2>

          <div className="space-y-4">
            {submittedAssignments.map((assignment) => (
              <div
                key={assignment._id}
                className="rounded-2xl border border-white/5 bg-black/20 p-6 hover:bg-white/5 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                          assignment.submissionStatus === 'reviewed' ? 'bg-[#d6ff00]/20 text-[#a5ff63]' : 'bg-blue-500/20 text-blue-300'
                       }`}>
                          {assignment.submissionStatus}
                       </span>
                       <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          {assignment.course?.title}
                       </span>
                    </div>
                    <h3 className="font-black text-white text-lg tracking-tight mb-4">{assignment.title}</h3>
                    
                    {assignment.submission?.feedback && (
                      <div className="p-4 rounded-xl bg-[#d6ff00]/5 border border-[#d6ff00]/10 italic text-[#d6ff00]/80 text-sm leading-relaxed mb-4">
                        <span className="text-[10px] font-black not-italic uppercase tracking-widest block mb-2 opacity-50">Teacher Feedback</span>
                        &quot;{assignment.submission.feedback}&quot;
                      </div>
                    )}
                    
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">
                       Submitted on {assignment.submission?.submittedAt ? new Date(assignment.submission.submittedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                    
                    {assignment.submission?.fileUrl && (
                      <button
                        onClick={() => setViewedPdf({ url: assignment.submission!.fileUrl!, name: `${assignment.title} Attachment` })}
                        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 hover:border-[#d6ff00] transition-colors"
                      >
                        <Eye size={14} className="text-[#d6ff00]" />
                        View Attached Work
                      </button>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 min-w-[120px] text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Grade</p>
                      {assignment.submission?.grade ? (
                        <p className="text-3xl font-black text-[#d6ff00]">{assignment.submission.grade}</p>
                      ) : (
                        <p className="text-xl font-bold text-slate-500">Grading</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewedPdf && (
        <PDFViewerModal 
          url={viewedPdf.url} 
          name={viewedPdf.name} 
          onClose={() => setViewedPdf(null)} 
        />
      )}
    </div>
  );
}
