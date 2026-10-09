"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/lib/useNotification";
import { FileText, Upload, Trash2, X, Plus, File } from "lucide-react";

interface Material {
  _id: string;
  name: string;
  url: string;
  fileType: string;
}

interface Lesson {
  _id: string;
  title: string;
  course: {
    _id: string;
    title: string;
  };
  materials: Material[];
}

interface Course {
  _id: string;
  title: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

const buildFileUrl = (url: string) =>
  url.startsWith("/uploads") ? `${apiBase}${url}` : url;

export default function LessonResourcesModule() {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data || []);
      }
    } catch (err) {
      error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses/${courseId}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLessons(data.data || []);
        setSelectedLesson(null);
      }
    } catch (err) {
      error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLesson) {
      error("Please select a lesson first");
      return;
    }

    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("materials", files[i]);
      }

      const res = await fetch(`${API_URL}/upload/lesson-materials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Add materials to lesson
        for (const file of data.data) {
          await fetch(`${API_URL}/lessons/${selectedLesson._id}/materials`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: file.name,
              url: file.url,
              fileType: file.fileType,
            }),
          });
        }

        success(`${files.length} file(s) uploaded successfully`);
        // Refresh lesson
        const updatedRes = await fetch(
          `${API_URL}/lessons/${selectedLesson._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setSelectedLesson(updatedData.data);
          setLessons(
            lessons.map((l) =>
              l._id === selectedLesson._id ? updatedData.data : l
            )
          );
        }
        setShowUploadForm(false);
      } else {
        error(data.message || "Failed to upload files");
      }
    } catch (err) {
      error("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMaterial = async (materialId: string) => {
    if (!selectedLesson) return;

    if (!confirm("Are you sure you want to remove this material?")) return;

    try {
      const res = await fetch(
        `${API_URL}/lessons/${selectedLesson._id}/materials/${materialId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success) {
        success("Material removed successfully");
        setSelectedLesson(data.data);
        setLessons(
          lessons.map((l) => (l._id === selectedLesson._id ? data.data : l))
        );
      } else {
        error(data.message || "Failed to remove material");
      }
    } catch (err) {
      error("Error removing material");
    }
  };

  if (!user || user.role !== "instructor") {
    return (
      <div className="text-center text-slate-400">
        You do not have permission to manage lesson resources
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Lesson Resources</h2>

      {/* Course Selection */}
      <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
        <label className="block text-sm font-semibold text-white mb-3">
          Select a Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
        >
          <option value="">Choose a course...</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Lessons List */}
      {selectedCourse && (
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Lessons ({lessons.length})
          </h3>
          {loading ? (
            <p className="text-slate-400">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="text-slate-400">No lessons found in this course</p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left rounded-lg border p-4 transition ${
                    selectedLesson?._id === lesson._id
                      ? "border-[#a5ff63] bg-[#a5ff63]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{lesson.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {lesson.materials.length} material(s)
                      </p>
                    </div>
                    <FileText size={18} className="text-[#a5ff63]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Lesson Details */}
      {selectedLesson && (
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {selectedLesson.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                From: {selectedLesson.course.title}
              </p>
            </div>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex items-center gap-2 rounded-lg bg-[#a5ff63] px-4 py-2 font-semibold text-black hover:bg-[#d6ff00] transition"
            >
              <Plus size={18} />
              Add Materials
            </button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Upload PDF Files
                </p>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="p-1 hover:bg-white/10 rounded transition"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              <label className="block">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#a5ff63] transition cursor-pointer">
                  <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-300">
                    Click to select PDF files (up to 10 files, 50MB each)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
              </label>

              {uploading && (
                <p className="text-sm text-[#a5ff63] text-center">
                  Uploading...
                </p>
              )}
            </div>
          )}

          {/* Materials List */}
          <div>
            <h4 className="text-md font-semibold text-white mb-3">
              Materials ({selectedLesson.materials.length})
            </h4>
            {selectedLesson.materials.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No materials uploaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {selectedLesson.materials.map((material) => (
                  <div
                    key={material._id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <File size={18} className="text-[#a5ff63]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {material.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {material.fileType}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={buildFileUrl(material.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-blue-900/30 text-blue-400 text-xs hover:bg-blue-900/50 transition"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => handleRemoveMaterial(material._id)}
                        className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
