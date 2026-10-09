"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, Search, Filter } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Admission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  program: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';
  appliedAt: string;
  documents: string[];
  notes?: string;
  user: {
    username: string;
    email: string;
  };
}

export default function AdmissionsManager() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/admissions?`;
      if (search) url += `search=${search}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdmissions(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdmissions();
  };

  const handleUpdateStatus = async (id: string, status: string, notes: string = "") => {
    try {
      setActionLoading(true);
      const res = await fetch(`${API_URL}/admissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
        },
        body: JSON.stringify({ status, notes })
      });
      const data = await res.json();
      if (data.success) {
        setAdmissions(admissions.map(a => a._id === id ? { ...a, status: status as any, notes } : a));
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#d7e4db] bg-white p-6">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[300px] gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#d8e4da] bg-[#f8fbf8] py-3 pl-12 pr-4 text-sm focus:border-[#d6ff00] focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-2xl bg-[#d6ff00] px-6 text-sm font-bold text-[#112014]">Search</button>
        </form>
        <div className="flex items-center gap-3">
           <Filter size={18} className="text-slate-400" />
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="rounded-2xl border border-[#d8e4da] bg-white px-4 py-3 text-sm focus:outline-none"
           >
             <option value="">All Statuses</option>
             <option value="Pending">Pending</option>
             <option value="Approved">Approved</option>
             <option value="Rejected">Rejected</option>
             <option value="Waitlisted">Waitlisted</option>
           </select>
        </div>
      </div>

      <section className="rounded-3xl border border-[#d7e4db] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fbf8] border-b border-[#d7e4db]">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#4d6a5a]">Applicant</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#4d6a5a]">Program</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#4d6a5a]">Applied Date</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#4d6a5a]">Status</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#4d6a5a]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7e4db]">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-sm text-[#4d6457]">Loading applications...</td></tr>
              ) : admissions.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-sm text-[#4d6457]">No applications found.</td></tr>
              ) : (
                admissions.map((a) => (
                  <tr key={a._id} className="hover:bg-[#f8fbf8] transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#183625]">{a.fullName}</span>
                        <span className="text-xs text-[#4d6457]">{a.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#183625]">{a.program}</td>
                    <td className="p-4 text-sm text-[#4d6457]">{new Date(a.appliedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                        a.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        a.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        a.status === 'Waitlisted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => { setSelectedAdmission(a); setIsDetailModalOpen(true); }}
                        className="flex items-center gap-2 text-blue-600 hover:underline font-medium text-sm"
                      >
                        <Eye size={16} /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedAdmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2.5rem] border border-[#d7e4db] bg-white p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#183625]">Application Review</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="rounded-xl p-2 hover:bg-[#f8fbf8] text-[#4d6457]">
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <p className="font-bold text-[#183625]">{selectedAdmission.fullName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <p className="font-bold text-[#183625]">{selectedAdmission.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  <p className="font-bold text-[#183625]">{selectedAdmission.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Program</label>
                  <p className="font-bold text-mint bg-[#112014] px-3 py-1 rounded-lg inline-block text-xs mt-1">{selectedAdmission.program}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted Documents</label>
                  <div className="mt-2 space-y-2">
                    {selectedAdmission.documents?.length > 0 ? (
                      selectedAdmission.documents.map((doc, idx) => (
                        <a key={idx} href={doc} target="_blank" className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                           View Document {idx + 1}
                        </a>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No documents attached.</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Notes</label>
                  <textarea 
                    className="mt-2 w-full rounded-xl border border-[#d8e4da] bg-[#f8fbf8] p-3 text-sm focus:border-[#d6ff00] focus:outline-none resize-none"
                    rows={3}
                    defaultValue={selectedAdmission.notes}
                    placeholder="Add notes for internal review..."
                    onBlur={(e) => selectedAdmission.notes = e.target.value}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-10 mt-10 border-t border-[#d8e4da]">
               <button 
                 disabled={actionLoading}
                 onClick={() => handleUpdateStatus(selectedAdmission._id, 'Approved', selectedAdmission.notes)}
                 className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#d6ff00] py-4 text-sm font-black text-[#112014] hover:bg-[#c4eb00] transition-colors disabled:opacity-50"
               >
                 <CheckCircle size={18} /> Approve Application
               </button>
               <button 
                 disabled={actionLoading}
                 onClick={() => handleUpdateStatus(selectedAdmission._id, 'Rejected', selectedAdmission.notes)}
                 className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-red-200 py-4 text-sm font-black text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
               >
                 <XCircle size={18} /> Reject
               </button>
            </div>
            <button 
              disabled={actionLoading}
              onClick={() => handleUpdateStatus(selectedAdmission._id, 'Waitlisted', selectedAdmission.notes)}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <Clock size={16} /> Move to Waitlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
