"use client";

import { X, Download } from "lucide-react";

interface PDFViewerModalProps {
  url: string;
  name: string;
  onClose: () => void;
}

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

const buildFileUrl = (url: string) =>
  url.startsWith("/uploads") ? `${apiBase}${url}` : url;

export default function PDFViewerModal({ url, name, onClose }: PDFViewerModalProps) {
  const fullUrl = buildFileUrl(url);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl h-screen max-h-[85vh] bg-[#0d1610] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative z-[101]">
        <div className="flex items-center justify-between bg-black/40 px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-black truncate tracking-wide pr-4">
            {name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-slate-200">
          <iframe
            src={`${fullUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-none"
            title="PDF Viewer"
          />
        </div>
        <div className="bg-black/60 px-6 py-4 border-t border-white/10 flex justify-end gap-3 rounded-b-3xl">
          <a
            href={fullUrl}
            download
            className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center gap-2 font-bold text-sm tracking-wider"
          >
            <Download size={16} />
            Download
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#d6ff00] text-[#08120f] hover:bg-[#c4eb00] hover:scale-105 active:scale-95 transition-all font-black text-sm tracking-wider shadow-lg shadow-[#d6ff00]/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
