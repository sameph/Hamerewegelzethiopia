"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Book, Edit2, Trash2, FileText, ImageIcon, Link as LinkIcon } from "lucide-react";

interface BookType {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  thumbnail: string;
  pdfUrl: string;
  price: number;
  isFree: boolean;
  createdAt: string;
}

export default function AdminBookManager() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "General",
    thumbnail: "",
    pdfUrl: "",
    price: 0,
    isFree: true
  });

  const [saving, setSaving] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/books`);
      const data = await res.json();
      if (data.success) setBooks(data.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBooks();
      setLoading(false);
    };
    init();
  }, []);

  const handleOpenCreate = () => {
    setEditingBook(null);
    setFormData({ 
      title: "", 
      author: "", 
      description: "", 
      category: "General", 
      thumbnail: "", 
      pdfUrl: "", 
      price: 0, 
      isFree: true 
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (book: BookType) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author || "",
      description: book.description || "",
      category: book.category || "General",
      thumbnail: book.thumbnail || "",
      pdfUrl: book.pdfUrl || "",
      price: book.price || 0,
      isFree: book.isFree ?? true
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploading(true);
    try {
      let currentThumbnail = formData.thumbnail;
      let currentPdfUrl = formData.pdfUrl;

      // Handle File Uploads First
      if (thumbFile || pdfFile) {
        const uploadData = new FormData();
        if (thumbFile) uploadData.append("thumbnail", thumbFile);
        if (pdfFile) uploadData.append("pdf", pdfFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/upload/book`, {
          method: "POST",
          headers: {
             "Authorization": `Bearer ${localStorage.getItem('lms_token')}`
          },
          body: uploadData
        });

        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
           if (uploadResult.data.thumbnail) currentThumbnail = uploadResult.data.thumbnail;
           if (uploadResult.data.pdf) currentPdfUrl = uploadResult.data.pdf;
        } else {
           throw new Error(uploadResult.message || "Upload failed");
        }
      }

      const bookData = {
        ...formData,
        thumbnail: currentThumbnail,
        pdfUrl: currentPdfUrl
      };

      const url = editingBook 
        ? `${process.env.NEXT_PUBLIC_API_URL || ""}/books/${editingBook._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || ""}/books`;
      
      const method = editingBook ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('lms_token')}`
        },
        body: JSON.stringify(bookData)
      });
      
      const data = await res.json();
      if (data.success) {
        await fetchBooks();
        setModalOpen(false);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err: any) {
      console.error("Book save error:", err);
      alert(err.message || "An error occurred");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this book?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/books/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem('lms_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setBooks(books.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error("Delete book error:", err);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  const resolveUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', "") || "";
    return `${baseUrl}${path}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[300px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#d6ff00]"
          />
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-2xl bg-[#d6ff00] px-6 py-3 text-sm font-bold text-[#112014] shadow-sm hover:scale-[1.02] transition-all"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-slate-100" />
          ))
        ) : filteredBooks.length === 0 ? (
           <div className="col-span-full py-20 text-center">
              <Book className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium tracking-tight">Library is empty.</p>
           </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book._id} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-[#d6ff00] hover:shadow-xl">
              <div className="flex items-start justify-between">
                <div className="h-16 w-12 rounded-lg bg-slate-100 overflow-hidden shadow-sm">
                  {book.thumbnail ? (
                    <img src={resolveUrl(book.thumbnail)} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <Book size={24} />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(book)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(book._id)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-[#163325] leading-tight line-clamp-2">{book.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{book.author || "Unknown Author"}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{book.category}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${book.isFree ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {book.isFree ? 'Free' : `${book.price} USD`}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#183625]">{editingBook ? "Modify Book" : "Add New Resource"}</h3>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    placeholder="Book title"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</label>
                  <input 
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thumbnail</label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-xs outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    />
                    <ImageIcon className="absolute left-3 top-3 text-slate-300" size={16} />
                  </div>
                  {editingBook && !thumbFile && (
                    <p className="text-[10px] text-slate-400 mt-1 italic ml-1">Leave empty to keep current thumbnail</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">PDF File</label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept=".pdf"
                      required={!editingBook}
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-xs outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                    />
                    <FileText className="absolute left-3 top-3 text-slate-300" size={16} />
                  </div>
                  {editingBook && !pdfFile && (
                    <p className="text-[10px] text-slate-400 mt-1 italic ml-1">Leave empty to keep current PDF</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                 <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                   <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                  >
                    <option value="General">General</option>
                    <option value="Theology">Theology</option>
                    <option value="History">History</option>
                    <option value="Manuscript">Manuscript</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price</label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox"
                    id="isFree"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({...formData, isFree: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-300 text-[#d6ff00] focus:ring-[#d6ff00]"
                  />
                  <label htmlFor="isFree" className="text-xs font-bold text-slate-600">Free Resource</label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d6ff00] focus:bg-white transition-all resize-none"
                  placeholder="Short summary..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button 
                  disabled={saving}
                  type="submit"
                  className="flex-[2] rounded-xl bg-[#d6ff00] py-3 text-sm font-black text-[#112014] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                   {uploading ? (editingBook ? "Uploading..." : "Uploading Files...") : (saving ? "Saving..." : editingBook ? "Update Book" : "Create Book")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
