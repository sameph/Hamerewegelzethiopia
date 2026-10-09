"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  User,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";

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
              className="h-48 animate-pulse rounded-3xl bg-slate-100"
            />
          ))
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium tracking-tight">
              No blogs found matching your criteria.
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-[#d6ff00] hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-[#f4faf5] text-[#24573c]">
                  <FileText size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-[#163325] leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {blog.category || "News"}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={12} />
                  <span className="text-xs font-medium">
                    {blog.readMin} min read
                  </span>
                </div>
              </div>
            </div>
          ))
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
