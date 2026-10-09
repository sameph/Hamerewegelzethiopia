import Link from "next/link";
import Image from "next/image";
import type { Course } from "./courseData";
import ProgressBar from "./ProgressBar";
import EnrollButton from "./EnrollButton";

interface CourseCardProps {
  course: Course;
  locale: string;
  onEnroll?: (course: Course) => void;
}

export default function CourseCard({ course, locale, onEnroll }: CourseCardProps) {
  return (
    <article className="group rounded-3xl border border-white/15 bg-[#162b1d] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d6ff00]/30 hover:shadow-lg hover:shadow-black/30">
      <div className="relative mb-4 h-36 w-full rounded-2xl bg-gradient-to-br from-[#2a3f2d] to-[#111f16] border border-white/10 flex items-center justify-center overflow-hidden">
         <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">🎓</span>
         {course.thumbnail && (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            />
         )}
      </div>

      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white group-hover:text-[#d6ff00] transition-colors line-clamp-1">{course.title}</h3>
          <p className="mt-1 text-[10px] uppercase font-black tracking-tighter text-slate-500">
            {typeof course.instructor === 'object' ? course.instructor.username : course.instructor || "Pastor Samuel"}
          </p>
        </div>
        <span className="rounded-full bg-[#d6ff00]/10 px-2 py-0.5 text-[0.65rem] font-black uppercase text-[#d6ff00]">
          {course.category}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-[0.65rem] text-slate-300">
        <span className="rounded-full bg-white/15 px-2 py-0.5">{course.duration || "Self-Paced"}</span>
        <span className="rounded-full bg-white/15 px-2 py-0.5">{course.difficulty}</span>
        {course.isPopular && <span className="rounded-full bg-[#2e7d52]/40 px-2 py-0.5 text-[#a5ff63]">Popular</span>}
      </div>

      {course.enrolled ? (
        <div className="mb-4">
          <ProgressBar value={course.progress || 0} />
        </div>
      ) : (
        <div className="mb-4 h-12 overflow-hidden">
           <p className="text-[10px] leading-relaxed text-slate-400 line-clamp-2">{course.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/${locale}/lms/dashboard/student/courses/view?id=${course._id || course.id}`}
          className="rounded-2xl border border-white/15 px-3 py-2 text-center text-xs font-bold text-slate-100 transition-colors hover:bg-white/10"
        >
          View Details
        </Link>
        <EnrollButton 
          enrolled={course.enrolled} 
          onClick={() => onEnroll && onEnroll(course)} 
          courseId={course._id || course.id}
          locale={locale}
        />
      </div>
    </article>
  );
}
