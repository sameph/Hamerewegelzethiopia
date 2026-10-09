"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Youtube, Mic, Edit2, Trash2, Clock } from "lucide-react";

interface Sermon {
  _id: string;
  title: string;
  speaker: string;
  series: string;
  category: "worship" | "preaching" | "teaching" | "song" | "prayer" | "testimony";
  type: "video" | "audio";
  youtubeUrl: string;
  youtubeId: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  language: "am" | "en" | "both";
  createdAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("lms_token") : "";

export default function AdminSermonManager() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [saving, setSaving] = useState(false);

  const defaultForm = {
    title: "",
    speaker: "",
    series: "",
    category: "worship" as "worship" | "preaching" | "teaching" | "song" | "prayer" | "testimony",
    type: "video" as "video" | "audio",
    youtubeUrl: "",
    duration: "",
    description: "",
    thumbnailUrl: "",
    language: "am" as "am" | "en" | "both",
  };
  const [form, setForm] = useState(defaultForm);

  const fetchSermons = async () => {
    try {
      const res = await fetch(`${API}/sermons`);
      const data = await res.json();
      if (data.success) setSermons(data.data);
    } catch (err) {
      console.error("Failed to fetch sermons:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSermons();
      setLoading(false);
    };
    init();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (s: Sermon) => {
    setEditing(s);
    setForm({
      title: s.title,
      speaker: s.speaker,
      series: s.series || "",
      category: s.category || "worship",
      type: s.type,
      youtubeUrl: s.youtubeUrl || "",
      duration: s.duration || "",
      description: s.description || "",
      thumbnailUrl: s.thumbnailUrl || "",
      language: s.language || "am",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing
      ? `${API}/sermons/${editing._id}`
      : `${API}/sermons`;
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSermons();
        setModalOpen(false);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Sermon save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this sermon permanently?")) return;
    try {
      const res = await fetch(`${API}/sermons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setSermons(sermons.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete sermon error:", err);
    }
  };

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speaker.toLowerCase().includes(search.toLowerCase()) ||
      (s.series || "").toLowerCase().includes(search.toLowerCase())
  );

  // Auto-extract YouTube thumbnail from URL
  const getYtThumb = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
    );
    return match
      ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
      : null;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[280px] flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search sermons, speakers, series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6ff00]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-[#d6ff00] px-6 py-3 text-sm font-bold text-[#112014] shadow-sm hover:scale-[1.02] transition-all"
        >
          <Plus size={18} /> Add Sermon
        </button>
      </div>

      {/* Sermon Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-3xl bg-slate-100" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Youtube className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No sermons found.</p>
          </div>
        ) : (
          filtered.map((s) => {
            const thumb = getYtThumb(s.youtubeUrl || "") || s.thumbnailUrl;
            return (
              <div
                key={s._id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1610] transition-all hover:border-[#d6ff00]/40 hover:shadow-xl"
              >
                {/* Thumbnail */}
                {thumb && (
                  <div className="aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={thumb}
                      alt={s.title}
                      className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {s.type === "video" ? (
                        <Youtube size={16} className="text-red-500 shrink-0" />
                      ) : (
                        <Mic size={16} className="text-[#4d6a5a] shrink-0" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {s.type} · {s.category || "worship"} · {s.language.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-[#d6ff00] hover:bg-white/10 transition-all"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white leading-tight line-clamp-2">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#4d6a5a]">{s.speaker}</p>
                  {s.series && (
                    <p className="mt-0.5 text-[11px] text-slate-400 italic">{s.series}</p>
                  )}
                  {s.duration && (
                    <div className="mt-3 flex items-center gap-1 text-slate-400">
                      <Clock size={11} />
                      <span className="text-[11px]">{s.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0d1610] p-8 md:p-10 shadow-2xl text-white">
            <h3 className="text-2xl font-black text-white">
              {editing ? "Edit Sermon" : "Add New Sermon"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {editing ? "Update the sermon details below." : "Fill in the details to post a new sermon."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Title */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Sermon Title
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all"
                    placeholder="e.g. ብርሃን - ከጨለማ ያመለጥንው"
                  />
                </div>

                {/* Speaker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Speaker
                  </label>
                  <input
                    required
                    value={form.speaker}
                    onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all"
                    placeholder="e.g. መ/ር ብርሃኑ አበጋዝ"
                  />
                </div>

                {/* Series */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Series (Optional)
                  </label>
                  <input
                    value={form.series}
                    onChange={(e) => setForm({ ...form, series: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all"
                    placeholder="e.g. ዱካ ፍለጋ"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as "video" | "audio" })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all appearance-none"
                  >
                    <option value="video" className="bg-[#0d1610] text-white">Video</option>
                    <option value="audio" className="bg-[#0d1610] text-white">Audio</option>
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Language
                  </label>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value as "am" | "en" | "both" })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all appearance-none"
                  >
                    <option value="am" className="bg-[#0d1610] text-white">Amharic (አማርኛ)</option>
                    <option value="en" className="bg-[#0d1610] text-white">English</option>
                    <option value="both" className="bg-[#0d1610] text-white">Both</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all appearance-none"
                  >
                    <option value="worship" className="bg-[#0d1610] text-white">Worship (አምልኮ)</option>
                    <option value="preaching" className="bg-[#0d1610] text-white">Preaching (ስብከት)</option>
                    <option value="teaching" className="bg-[#0d1610] text-white">Teaching (ትምህርት)</option>
                    <option value="song" className="bg-[#0d1610] text-white">Song (መዝሙር)</option>
                    <option value="prayer" className="bg-[#0d1610] text-white">Prayer (ጸሎት)</option>
                    <option value="testimony" className="bg-[#0d1610] text-white">Testimony (ምስክርነት)</option>
                  </select>
                </div>

                {/* YouTube URL */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    YouTube URL
                  </label>
                  <input
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                    type="url"
                  />
                  {form.youtubeUrl && getYtThumb(form.youtubeUrl) && (
                    <div className="mt-2 w-40 overflow-hidden rounded-xl border border-white/10">
                      <img
                        src={getYtThumb(form.youtubeUrl)!}
                        alt="YouTube preview"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Duration (Optional)
                  </label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all"
                    placeholder="e.g. 45:30"
                  />
                </div>

                {/* Thumbnail URL (fallback) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Custom Thumbnail URL (Optional)
                  </label>
                  <input
                    value={form.thumbnailUrl}
                    onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all"
                    placeholder="https://..."
                    type="url"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none focus:border-[#d6ff00] focus:bg-white/10 transition-all resize-none"
                    placeholder="Short description or scripture reference..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="flex-[2] rounded-xl bg-[#d6ff00] py-4 text-sm font-black text-[#112014] shadow-lg hover:bg-[#c4eb00] transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update Sermon" : "Publish Sermon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
