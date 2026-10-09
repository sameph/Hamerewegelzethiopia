"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminCourseManager from "./lms/AdminCourseManager";
import AdminBookManager from "./lms/AdminBookManager";
import AdminBlogManager from "./lms/AdminBlogManager";
import AdmissionsManager from "./lms/AdmissionsManager";
import AdminSermonManager from "./AdminSermonManager";
import {
  Users,
  GraduationCap,
  BookOpen,
  Library,
  Inbox,
  Video,
  LayoutDashboard,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  Loader2,
  ChevronRight,
  Menu,
  FileText,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "";

const sidebarPartitions = [
  {
    title: "Saint Cyril LMS",
    items: [
      { slug: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { slug: "admissions", label: "Admissions", icon: Inbox },
      { slug: "students", label: "Students", icon: GraduationCap },
      { slug: "teachers", label: "Teachers", icon: Users },
      { slug: "courses", label: "Courses", icon: BookOpen },
      { slug: "library", label: "Library", icon: Library },
    ],
  },
  {
    title: "Hamere Wengel",
    items: [
      { slug: "sermons", label: "Sermons", icon: Video },
      { slug: "news-articles", label: "News & Articles", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [{ slug: "settings", label: "Settings", icon: Settings }],
  },
];

function normalizeRole(role: string) {
  const r = String(role || "")
    .trim()
    .toLowerCase();
  if (["super admin", "super-admin", "administrator", "admin"].includes(r))
    return "administrator";
  if (r === "teacher" || r === "instructor") return "teacher";
  return "student";
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("lms_token")}` };
}

function jsonHeaders() {
  return { ...authHeaders(), "Content-Type": "application/json" };
}

/* ─── USER TABLE ──────────────────────────────────────────────────── */
function UserTable({
  users,
  loading,
  columns,
  onEdit,
  onDelete,
}: {
  users: any[];
  loading: boolean;
  columns: { key: string; label: string }[];
  onEdit: (u: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#0b1810] border-b border-white/10">
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500"
              >
                {c.label}
              </th>
            ))}
            <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="py-16 text-center">
                <Loader2 className="animate-spin mx-auto text-mint" size={28} />
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="py-16 text-center text-slate-500 text-sm"
              >
                No records found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-4 text-sm text-slate-200">
                    {c.key === "createdAt"
                      ? u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"
                      : u[c.key] || "—"}
                  </td>
                ))}
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(u)}
                      className="text-slate-400 hover:text-[#d6ff00] transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(u._id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ─── EDIT MODAL ──────────────────────────────────────────────────── */
function EditModal({
  title,
  user,
  fields,
  onChange,
  onSave,
  onClose,
  loading,
}: {
  title: string;
  user: any;
  fields: { key: string; label: string; type?: string }[];
  onChange: (key: string, val: string) => void;
  onSave: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1610] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                value={user[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d6ff00] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex-1 rounded-xl bg-[#d6ff00] py-2.5 text-sm font-black text-[#08120f] hover:bg-[#c4eb00] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────── */
export default function AdminDashboard({ section }: { section?: string }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const locale = useMemo(
    () => (pathname.split("/")[1] === "am" ? "am" : "en"),
    [pathname]
  );
  const current = section ? section : "dashboard";
  const prefix = `/${locale}/admin`;

  // ── Stats
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    courseCount: 0,
    pendingAdmissions: 0,
  });

  const formatCount = (value?: number | null) => {
    return typeof value === "number" ? value.toLocaleString() : "0";
  };

  // ── Teachers
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);

  // ── Students
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // ── Invite Teacher modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState({ type: "", text: "" });

  // ── Edit modals
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);

  // ─── Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/${locale}/lms/login`);
      return;
    }
    if (!user.role) {
      router.replace(`/${locale}/lms/login`);
      return;
    }
    if (normalizeRole(user.role) !== "administrator") {
      router.replace(`/${locale}/lms/dashboard/${normalizeRole(user.role)}`);
    }
  }, [user, authLoading, locale, router]);

  // ─── Fetch stats
  useEffect(() => {
    if (!user) return;
    fetch(`${API}/auth/admin/stats`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});
  }, [user]);

  // ─── Fetch teachers
  useEffect(() => {
    if (current !== "teachers" || !user) return;
    setTeachersLoading(true);
    fetch(`${API}/users?role=instructor`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeachers(d.data);
      })
      .catch(() => {})
      .finally(() => setTeachersLoading(false));
  }, [current, user]);

  // ─── Fetch students
  useEffect(() => {
    if (current !== "students" || !user) return;
    setStudentsLoading(true);
    fetch(`${API}/users?role=student`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStudents(d.data);
      })
      .catch(() => {})
      .finally(() => setStudentsLoading(false));
  }, [current, user]);

  // ─── Invite teacher
  const handleInviteTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/auth/admin/invite-teacher`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(inviteData),
      });
      const d = await res.json();
      if (d.success) {
        setInviteMsg({
          type: "success",
          text: "Teacher invited successfully!",
        });
        setInviteData({ username: "", email: "", password: "" });
        setTimeout(() => setInviteOpen(false), 1800);
        setTeachers((prev) => [d.data, ...prev]);
        setStats((s) => ({ ...s, teacherCount: s.teacherCount + 1 }));
      } else {
        setInviteMsg({
          type: "error",
          text: d.message || "Failed to invite teacher",
        });
      }
    } catch {
      setInviteMsg({ type: "error", text: "Network error. Try again." });
    } finally {
      setInviteLoading(false);
    }
  };

  // ─── Delete user
  const deleteUser = async (id: string, onRemove: () => void) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const d = await res.json();
    if (d.success) onRemove();
  };

  // ─── Update user
  const updateUser = async (data: any, onSuccess: (updated: any) => void) => {
    setEditLoading(true);
    try {
      const res = await fetch(`${API}/users/${data._id}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      });
      const d = await res.json();
      if (d.success) onSuccess(d.data);
    } catch {}
    setEditLoading(false);
  };

  const statCards = [
    {
      label: "Total Students",
      value: stats.studentCount ?? 0,
      color: "text-[#d6ff00]",
    },
    {
      label: "Total Teachers",
      value: stats.teacherCount ?? 0,
      color: "text-[#a5ff63]",
    },
    {
      label: "Active Courses",
      value: stats.courseCount ?? 0,
      color: "text-[#63d6ff]",
    },
    {
      label: "Pending Admissions",
      value: stats.pendingAdmissions ?? 0,
      color: "text-[#ffa726]",
    },
  ];

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#08120f]">
        <Loader2 className="animate-spin text-mint" size={36} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#08120f] overflow-hidden text-white">
      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1610] border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-6 border-b border-white/10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Super Admin
          </p>
          <h1 className="mt-1 text-lg font-black text-white leading-tight">
            Hamerewegelz
          </h1>
          <p className="text-[11px] text-slate-500">Admin Platform</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {sidebarPartitions.map((part) => (
            <div key={part.title} className="mb-6">
              <p className="mb-2 px-4 text-xs font-black uppercase tracking-widest text-slate-500">
                {part.title}
              </p>
              <ul className="space-y-1">
                {part.items.map(({ slug, label, icon: Icon }) => {
                  const active = current === slug;
                  return (
                    <li key={slug}>
                      <Link
                        href={`${prefix}/${slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          active
                            ? "bg-[#d6ff00] text-[#08120f]"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-4">
            <p className="text-sm font-bold text-white">{user?.username}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* topbar */}
        <header className="h-16 border-b border-white/10 bg-[#08120f]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="text-white font-bold capitalize">{current}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#d6ff00]/10 border border-[#d6ff00]/20 px-3 py-1 text-[11px] font-black text-[#d6ff00] uppercase tracking-widest">
              Super Admin
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* ── DASHBOARD ── */}
          {current === "dashboard" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">
                  Dashboard Overview
                </h2>
                <p className="text-slate-400 mt-1">
                  Real-time stats from your LMS platform.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {statCards.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-white/10 bg-[#0d1610] p-6"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      {c.label}
                    </p>
                    <p className={`mt-3 text-4xl font-black ${c.color}`}>
                      {formatCount(c.value)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {sidebarPartitions
                  .flatMap((p) => p.items)
                  .filter(
                    (s: any) => s.slug !== "dashboard" && s.slug !== "settings"
                  )
                  .map(({ slug, label, icon: Icon }: any) => (
                    <Link
                      key={slug}
                      href={`${prefix}/${slug}`}
                      className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#0d1610] hover:border-[#d6ff00]/30 hover:bg-[#d6ff00]/5 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#d6ff00] transition-colors">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-black text-white group-hover:text-[#d6ff00] transition-colors">
                          {label}
                        </p>
                        <p className="text-xs text-slate-500">
                          Manage {label.toLowerCase()}
                        </p>
                      </div>
                      <ChevronRight
                        className="ml-auto text-slate-700 group-hover:text-[#d6ff00] transition-colors"
                        size={18}
                      />
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* ── TEACHERS ── */}
          {current === "teachers" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white">Teachers</h2>
                  <p className="text-slate-400 mt-1">
                    {stats.teacherCount} instructors registered
                  </p>
                </div>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#d6ff00] px-4 py-2.5 text-sm font-black text-[#08120f] hover:bg-[#c4eb00] transition-colors"
                >
                  <Plus size={16} /> Invite Teacher
                </button>
              </div>
              <UserTable
                users={teachers}
                loading={teachersLoading}
                columns={[
                  { key: "username", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "createdAt", label: "Joined" },
                ]}
                onEdit={(t) => setEditingTeacher({ ...t })}
                onDelete={(id) =>
                  deleteUser(id, () =>
                    setTeachers((prev) => prev.filter((t) => t._id !== id))
                  )
                }
              />
            </>
          )}

          {/* ── STUDENTS ── */}
          {current === "students" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">Students</h2>
                <p className="text-slate-400 mt-1">
                  {stats.studentCount} students registered
                </p>
              </div>
              <UserTable
                users={students}
                loading={studentsLoading}
                columns={[
                  { key: "username", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "program", label: "Program" },
                  { key: "createdAt", label: "Joined" },
                ]}
                onEdit={(s) => setEditingStudent({ ...s })}
                onDelete={(id) =>
                  deleteUser(id, () =>
                    setStudents((prev) => prev.filter((s) => s._id !== id))
                  )
                }
              />
            </>
          )}

          {/* ── COURSES ── */}
          {current === "courses" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">Courses</h2>
                <p className="text-slate-400 mt-1">
                  Manage all published and draft courses
                </p>
              </div>
              <AdminCourseManager />
            </>
          )}

          {/* ── LIBRARY ── */}
          {current === "library" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">Library</h2>
                <p className="text-slate-400 mt-1">
                  Manage digital books and resources
                </p>
              </div>
              <AdminBookManager />
            </>
          )}

          {/* ── ADMISSIONS ── */}
          {current === "admissions" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">Admissions</h2>
                <p className="text-slate-400 mt-1">
                  Manage student applications
                </p>
              </div>
              <AdmissionsManager />
            </>
          )}

          {/* ── SERMONS ── */}
          {current === "sermons" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">Sermons</h2>
                <p className="text-slate-400 mt-1">
                  Manage video and audio sermons
                </p>
              </div>
              <AdminSermonManager />
            </>
          )}

          {/* ── NEWS & ARTICLES ── */}
          {current === "news-articles" && (
            <>
              <div>
                <h2 className="text-3xl font-black text-white">
                  News & Articles
                </h2>
                <p className="text-slate-400 mt-1">
                  Manage articles, teachings, and news
                </p>
              </div>
              <AdminBlogManager />
            </>
          )}

          {/* ── SETTINGS ── */}
          {current === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white">Settings</h2>
                <p className="text-slate-400 mt-1">Platform configuration</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Global Settings */}
                <div className="rounded-2xl border border-white/10 bg-[#0d1610] p-6 space-y-5">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Global System
                  </h3>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Hamerewegelz Ethiopia"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d6ff00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="info@hamerewengel.org"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d6ff00] transition-colors"
                    />
                  </div>
                  <button className="rounded-xl bg-[#d6ff00] px-4 py-2 text-sm font-black text-[#08120f] hover:bg-[#c4eb00] transition-colors">
                    Save Changes
                  </button>
                </div>

                {/* Account Settings */}
                <div className="rounded-2xl border border-white/10 bg-[#0d1610] p-6 space-y-5">
                  <h3 className="text-lg font-bold text-white mb-2">
                    My Profile
                  </h3>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.username || ""}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d6ff00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d6ff00] transition-colors"
                    />
                  </div>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d1610] p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Role System", value: "3 Active Roles" },
                    { label: "Storage", value: "84 GB Used" },
                    { label: "API Version", value: "v1.0" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl bg-white/5 p-5">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        {c.label}
                      </p>
                      <p className="mt-2 text-xl font-black text-white">
                        {c.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm font-bold text-slate-400 mb-3">
                    Registered Roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Super Admin (administrator)",
                      "Instructor (instructor)",
                      "Student (student)",
                    ].map((r) => (
                      <span
                        key={r}
                        className="px-3 py-1.5 rounded-full bg-[#d6ff00]/10 border border-[#d6ff00]/20 text-xs font-black text-[#d6ff00]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── INVITE TEACHER MODAL ── */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d1610] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Invite Teacher</h3>
              <button
                onClick={() => setInviteOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleInviteTeacher} className="space-y-4">
              {[
                {
                  key: "username",
                  label: "Username",
                  type: "text",
                  placeholder: "johndoe",
                },
                {
                  key: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "teacher@example.com",
                },
                {
                  key: "password",
                  label: "Temporary Password",
                  type: "password",
                  placeholder: "••••••••",
                },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    {f.label}
                  </label>
                  <input
                    required
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(inviteData as any)[f.key]}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, [f.key]: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d6ff00] transition-colors"
                  />
                </div>
              ))}
              {inviteMsg.text && (
                <p
                  className={`text-sm font-bold ${
                    inviteMsg.type === "success"
                      ? "text-[#a5ff63]"
                      : "text-red-400"
                  }`}
                >
                  {inviteMsg.text}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 rounded-xl bg-[#d6ff00] py-2.5 text-sm font-black text-[#08120f] hover:bg-[#c4eb00] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {inviteLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT TEACHER MODAL ── */}
      {editingTeacher && (
        <EditModal
          title="Edit Teacher"
          user={editingTeacher}
          fields={[
            { key: "username", label: "Username" },
            { key: "email", label: "Email", type: "email" },
          ]}
          onChange={(k, v) => setEditingTeacher({ ...editingTeacher, [k]: v })}
          onSave={() =>
            updateUser(editingTeacher, (updated) => {
              setTeachers((prev) =>
                prev.map((t) => (t._id === updated._id ? updated : t))
              );
              setEditingTeacher(null);
            })
          }
          onClose={() => setEditingTeacher(null)}
          loading={editLoading}
        />
      )}

      {/* ── EDIT STUDENT MODAL ── */}
      {editingStudent && (
        <EditModal
          title="Edit Student"
          user={editingStudent}
          fields={[
            { key: "username", label: "Username" },
            { key: "email", label: "Email", type: "email" },
            { key: "program", label: "Program" },
            { key: "batch", label: "Batch" },
          ]}
          onChange={(k, v) => setEditingStudent({ ...editingStudent, [k]: v })}
          onSave={() =>
            updateUser(editingStudent, (updated) => {
              setStudents((prev) =>
                prev.map((s) => (s._id === updated._id ? updated : s))
              );
              setEditingStudent(null);
            })
          }
          onClose={() => setEditingStudent(null)}
          loading={editLoading}
        />
      )}
    </div>
  );
}
