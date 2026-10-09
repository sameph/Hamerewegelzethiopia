"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CourseDetails = {
  title: string;
  instructor: string;
  progress: number;
  modules: { name: string; lessons: string[] }[];
  currentLesson: string;
  notes: string;
};

export default function CourseClient({ id }: { id: string }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("lmsAuth");
    if (!auth) router.replace("/lms/login");
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/courses/${id}`);
        if (!res.ok) {
          setError("Course not found");
          setCourse(null);
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          if (!cancelled) {
            setCourse({
              title: d.title || "Untitled",
              instructor: d.instructor?.username || d.instructor || "",
              progress: 0,
              modules: (d.lessons || []).map((m: any) => ({
                name: m.title || "Module",
                lessons: (m.items || []).map((it: any) => it.title || "Lesson"),
              })),
              currentLesson: d.currentLesson || "",
              notes: d.notes || "",
            });
          }
        } else {
          setError(data.message || "Course not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, API_URL]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4 text-slate-100">
        Loading...
      </main>
    );
  }

  if (!course) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl p-4 text-slate-100">
        <p>{error || "Course not found."}</p>
        <Link href="/lms/courses" className="text-amber-300 underline">
          Back to courses
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 text-slate-100">
      <div className="mb-4 flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-amber-200">
            {course.title}
          </h1>
          <p className="text-sm text-slate-300">
            Instructor: {course.instructor}
          </p>
          <p className="text-xs text-slate-400">Progress: {course.progress}%</p>
        </div>
        <Link
          href="/lms/courses"
          className="rounded-lg border border-amber-300 px-3 py-1 text-slate-100 hover:bg-limeCTA/20"
        >
          Back to Courses
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-1 rounded-xl border border-amber-300/30 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-amber-200">Module List</h2>
          {course.modules.map((module) => (
            <div key={module.name} className="mt-3">
              <p className="text-sm font-medium text-slate-100">
                {module.name}
              </p>
              <ul className="mt-1 space-y-1 text-sm text-slate-300">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson}
                    className={`rounded-md px-2 py-1 ${
                      lesson === course.currentLesson
                        ? "bg-amber-400/25 text-amber-100"
                        : "bg-slate-800/60"
                    }`}
                  >
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="col-span-2 rounded-xl border border-amber-300/30 bg-slate-900/80 p-4">
          <h2 className="text-xl font-semibold text-amber-200">
            Current Lesson
          </h2>
          <p className="mt-1 text-lg text-slate-100">{course.currentLesson}</p>
          <div className="mt-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-200">
            <p>{course.notes}</p>
          </div>

          <div className="mt-4 rounded-lg border border-amber-300/20 bg-slate-800 p-3 text-sm text-slate-200">
            <h3 className="font-semibold text-amber-200">Notes</h3>
            <textarea
              className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-100 focus:border-amber-300 focus:outline-none"
              defaultValue={course.notes}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
