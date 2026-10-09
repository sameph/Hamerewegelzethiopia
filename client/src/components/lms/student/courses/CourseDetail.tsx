import Link from "next/link";
import type { Course } from "./courseData";
import LessonList from "./LessonList";
import ProgressBar from "./ProgressBar";

interface CourseDetailProps {
  course: Course;
  locale: string;
  chapters: any[];
}

export default function CourseDetail({ course, locale, chapters }: CourseDetailProps) {
  const completedLessons = course.lessons.filter((lesson) => lesson.completed).length;
  const pendingLessons = Math.max(course.lessons.length - completedLessons, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#a5ff63]">Course Detail</p>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <p className="mt-2 text-sm text-slate-300">{course.description}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-[0.65rem] text-slate-300">
              <span className="rounded-full bg-white/10 px-2 py-1">{course.category}</span>
              <span className="rounded-full bg-white/10 px-2 py-1">{course.difficulty}</span>
              <span className="rounded-full bg-white/10 px-2 py-1">{course.duration}</span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                Instructor: {typeof course.instructor === 'object' ? course.instructor.username : course.instructor}
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-sm font-semibold text-white">Learning Outcomes</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {course.outcomes.map((outcome) => (
                  <li key={outcome}>- {outcome}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Course Progress Overview</h3>
            <div className="mt-3 space-y-3 text-xs text-slate-300">
              <ProgressBar value={course.progress} />
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-400">Total Lessons</p>
                  <p className="text-lg font-bold text-white">{course.lessons.length}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-400">Completed</p>
                  <p className="text-lg font-bold text-white">{completedLessons}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-400">Pending</p>
                  <p className="text-lg font-bold text-white">{pendingLessons}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-slate-400">Grade</p>
                  <p className="text-lg font-bold text-white">A-</p>
                </div>
              </div>

              <Link 
                href={`/${locale}/lms/dashboard/student/courses/learn?id=${course.id}`}
                className="w-full rounded-2xl bg-mint/10 border border-mint/20 px-3 py-3 text-xs font-black text-center text-mint hover:bg-mint/20 transition-all block"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Lesson List Access</h2>
          <Link
            href={`/${locale}/lms/dashboard/student/courses`}
            className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10"
          >
            Back to Courses
          </Link>
        </div>
        <LessonList lessons={course.lessons} locale={locale} courseId={course.id} chapters={chapters} />
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white">Assignments, Quizzes, Certificates</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-2xl bg-white/5 p-4 text-slate-200">2 active quizzes available</div>
          <div className="rounded-2xl bg-white/5 p-4 text-slate-200">1 assignment due this week</div>
          <div className="rounded-2xl bg-white/5 p-4 text-slate-200">Certificate unlocks at 100% completion</div>
        </div>
      </section>
    </div>
  );
}
