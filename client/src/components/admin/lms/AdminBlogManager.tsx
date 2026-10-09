"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Edit2,
  Trash2,
  Clock,
  ImageIcon,
} from "lucide-react";

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  News:     { bg: "#D6FF00", text: "#112014" },
  Teaching: { bg: "#A6FF4D", text: "#112014" },
  Article:  { bg: "#63d6ff", text: "#0a1f14" },
};

interface Blog {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  readMin: string;
  createdAt: string;
}

export default function AdminBlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "News",
    excerpt: "",
    content: "",
    thumbnail: "",
    readMin: "5",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/blogs`
      );
      const data = await res.json();
      if (data.success) setBlogs(data.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBlogs();
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      category: "News",
      excerpt: "",
      content: "",
      thumbnail: "",
      readMin: "5",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category || "News",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      thumbnail: blog.thumbnail || "",
      readMin: blog.readMin || "5",
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
          },
          body: form,
        }
      );
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, thumbnail: data.data.url }));
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingBlog
        ? `${
            process.env.NEXT_PUBLIC_API_URL || ""
          }/blogs/${editingBlog._id}`
        : `${
            process.env.NEXT_PUBLIC_API_URL || ""
          }/blogs`;

      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchBlogs();
        setModalOpen(false);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Blog save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this blog post?")) return;
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error("Delete blog error:", err);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[300px] flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6ff00]"
          />
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-2xl bg-[#d6ff00] px-6 py-3 text-sm font-bold text-[#112014] shadow-sm hover:scale-[1.02] transition-all"
        >
          <Plus size={18} /> New Blog Post
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-white/5"
            />
          ))
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <FileText className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-500 font-medium tracking-tight">
              No blogs found matching your criteria.
            </p>
          </div>
        ) : (
        filteredBlogs.map((blog) => {
            const catColor = CAT_COLORS[blog.category] ?? { bg: "#e2e8f0", text: "#334155" };
            const excerptText = (blog.excerpt || "")
              .replace(/<[^>]*>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 100);

            return (
            <div
              key={blog._id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1610] transition-all hover:border-[#d6ff00]/40 hover:shadow-[0_8px_32px_rgba(214,255,0,.08)]"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden bg-[#0b1810] shrink-0">
                {blog.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-700">
                    <ImageIcon size={36} />
                  </div>
                )}
                {/* Category badge */}
                <span
                  className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: catColor.bg, color: catColor.text }}
                >
                  {blog.category || "News"}
                </span>
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-[#d6ff00] hover:bg-black/80 transition-all backdrop-blur-sm"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-red-400 hover:bg-black/80 transition-all backdrop-blur-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-[0.95rem] font-bold text-white leading-snug line-clamp-2 group-hover:text-[#d6ff00] transition-colors mb-2">
                  {blog.title}
                </h3>
                {excerptText && (
                  <p className="text-[0.78rem] text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-4">
                    {excerptText}{excerptText.length >= 100 ? "…" : ""}
                  </p>
                )}

                {/* Footer meta */}
                <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock size={12} />
                    <span className="text-xs">{blog.readMin} min read</span>
                  </div>
                  <span className="text-[10px] text-slate-600">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#183625]">
              {editingBlog ? "Modify Blog Post" : "Compose New Post"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Publish insightful content for the community.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Title
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    placeholder="E.g. The History of the Church"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none focus:border-[#d6ff00] focus:bg-white transition-all appearance-none"
                  >
                    <option value="News">News / ዜና</option>
                    <option value="Teaching">Teaching / ትምህርት</option>
                    <option value="Article">Article / ጽሑፍ</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Read Time (Mins)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.readMin}
                    onChange={(e) =>
                      setFormData({ ...formData, readMin: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    {uploadingImage ? "Uploading..." : "Thumbnail Image"}
                  </label>
                  {formData.thumbnail && (
                    <div className="mb-2 h-16 w-16 overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all file:mr-4 file:rounded-full file:border-0 file:bg-[#d6ff00]/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#112014] hover:file:bg-[#d6ff00]/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Excerpt (Short Summary)
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#d6ff00] focus:bg-white transition-all resize-none"
                  placeholder="A brief summary for the blog cards..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Main Content
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={10}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#d6ff00] focus:bg-white transition-all resize-none font-mono"
                  placeholder="Enter full blog content here (Supports HTML/Markdown)..."
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
                  {saving
                    ? "Processing..."
                    : editingBlog
                    ? "Update Post"
                    : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
