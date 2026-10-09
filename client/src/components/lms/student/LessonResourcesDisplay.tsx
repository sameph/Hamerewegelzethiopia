"use client";

import { useState } from "react";
import { FileText, Download, X, Eye } from "lucide-react";
import PDFViewerModal from "@/components/lms/PDFViewerModal";

interface Material {
  _id: string;
  name: string;
  url: string;
  fileType: string;
}

interface LessonResourcesDisplayProps {
  lessonId: string;
  materials: Material[];
}

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

const buildFileUrl = (url: string) =>
  url.startsWith("/uploads") ? `${apiBase}${url}` : url;

export default function LessonResourcesDisplay({
  materials,
}: LessonResourcesDisplayProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  if (!materials || materials.length === 0) {
    return null;
  }

  return (
    <>
      <section className="rounded-2xl border border-white/20 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          📚 Learning Materials ({materials.length})
        </h3>
        <div className="grid gap-3">
          {materials.map((material) => (
            <div
              key={material._id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[#a5ff63]" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">
                    {material.name}
                  </p>
                  <p className="text-xs text-slate-400 uppercase">
                    {material.fileType}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMaterial(material)}
                  className="px-3 py-1 rounded-lg bg-blue-900/30 text-blue-400 text-sm hover:bg-blue-900/50 transition"
                >
                  Read
                </button>
                <a
                  href={buildFileUrl(material.url)}
                  download
                  className="p-2 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 transition"
                  title="Download"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {selectedMaterial && (
        <PDFViewerModal 
          url={selectedMaterial.url}
          name={selectedMaterial.name}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </>
  );
}
