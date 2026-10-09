import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, PlayCircle, Lock } from "lucide-react";

interface LessonListProps {
  lessons: any[];
  locale: string;
  courseId: string;
  chapters?: any[];
}

function LessonTypeIcon({ type }: { type: string }) {
  if (type === "video") return <span className="text-mint">Video</span>;
  if (type === "document")
    return <span className="text-blue-400">Document</span>;
  return <span className="text-slate-400">Reading</span>;
}

export default function LessonList({
  lessons,
  locale,
  courseId,
  chapters = [],
}: LessonListProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(chapters.map((c) => c._id || c.id))
  );

  const toggleChapter = (chapterId: string) => {
    const next = new Set(expandedChapters);
    if (next.has(chapterId)) next.delete(chapterId);
    else next.add(chapterId);
    setExpandedChapters(next);
  };

  // If no chapters, show flat list
  if (!chapters || chapters.length === 0) {
    return (
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            No lessons available yet.
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <LessonRow
              key={lesson.id || lesson._id}
              lesson={lesson}
              index={index}
              locale={locale}
              courseId={courseId}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => {
        const chapterId = chapter._id || chapter.id;
        const isExpanded = expandedChapters.has(chapterId);
        const chapterLessons = lessons.filter((l) => l.chapter === chapterId);

        return (
          <div
            key={chapterId}
            className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all"
          >
            <button
              onClick={() => toggleChapter(chapterId)}
              className="flex w-full items-center justify-between p-6 hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-500 group-hover:text-mint transition-all">
                  <PlayCircle size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {chapterLessons.length} Learning Modules
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-white/5" />
                {isExpanded ? (
                  <ChevronUp className="text-slate-500" />
                ) : (
                  <ChevronDown className="text-slate-500" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="space-y-3 p-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                {chapterLessons.map((lesson, idx) => (
                  <LessonRow
                    key={lesson.id || lesson._id}
                    lesson={lesson}
                    index={idx}
                    locale={locale}
                    courseId={courseId}
                  />
                ))}
                {chapterLessons.length === 0 && (
                  <p className="px-6 py-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest italic border border-dashed border-white/5 rounded-2xl">
                    No modules in this block
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonRow({
  lesson,
  index,
  locale,
  courseId,
}: {
  lesson: any;
  index: number;
  locale: string;
  courseId: string;
}) {
  return (
    <div className="group rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-6 hover:border-mint/30 hover:bg-white/[0.05] transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-[10px] font-black text-slate-500 group-hover:bg-mint group-hover:text-[#08120f] transition-all">
            {index + 1}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-mint transition-colors">
              {lesson.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                <LessonTypeIcon type={lesson.type} />
              </span>
              {lesson.duration && (
                <span className="text-[9px] font-medium text-slate-500">
                  • {lesson.duration}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lesson.completed ? (
            <span className="rounded-lg bg-mint/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-mint border border-mint/20">
              Mastered
            </span>
          ) : (
            <span className="rounded-lg bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-white/5">
              Pending
            </span>
          )}
          <Link
            href={`/${locale}/lms/dashboard/student/courses/learn?id=${courseId}`}
            className="rounded-xl bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-mint hover:text-[#08120f] transition-all border border-white/10"
          >
            Open Stage
          </Link>
        </div>
      </div>
    </div>
  );
}
