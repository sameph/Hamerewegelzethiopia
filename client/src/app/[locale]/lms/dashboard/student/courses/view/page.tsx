"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CourseDetail from "@/components/lms/student/courses/CourseDetail";
import type { Course } from "@/components/lms/student/courses/courseData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function CourseViewContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const courseId = searchParams.get('id');
  const locale = (params?.locale as string) || "en";

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const [courseRes, chaptersRes] = await Promise.all([
          fetch(`${API_URL}/courses/${courseId}`),
          fetch(`${API_URL}/chapters/course/${courseId}`)
        ]);

        const courseData = await courseRes.json();
        const chaptersData = await chaptersRes.json();

        if (courseData.success) {
          setCourse({
            ...courseData.data,
            id: courseData.data._id,
            enrolled: true, 
            progress: 0,
            lessons: (courseData.data.lessons || []).map((l: any) => ({ ...l, id: l._id })),
            outcomes: courseData.data.outcomes || []
          });
        } else {
          setError("Course not found");
        }

        if (chaptersData.success) {
          setChapters(chaptersData.data.sort((a: any, b: any) => a.order - b.order));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#08120f]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d6ff00]" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-[#08120f]">
        <p className="text-red-400">{error || "Course not found"}</p>
        <button onClick={() => window.history.back()} className="text-sm underline text-slate-300">Go back</button>
      </div>
    );
  }

  return <CourseDetail course={course} locale={locale} chapters={chapters} />;
}

export default function StudentCourseDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#08120f]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d6ff00]" />
      </div>
    }>
      <CourseViewContent />
    </Suspense>
  );
}
