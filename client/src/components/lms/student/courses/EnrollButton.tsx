import Link from "next/link";

interface EnrollButtonProps {
  enrolled?: boolean;
  onClick?: () => void;
  courseId?: string;
  locale?: string;
}

export default function EnrollButton({ enrolled, onClick, courseId, locale }: EnrollButtonProps) {
  if (enrolled && courseId) {
    return (
      <Link 
        href={`/${locale || 'en'}/lms/dashboard/student/courses/learn?id=${courseId}`}
        className="w-full rounded-2xl bg-mint/10 border border-mint/20 px-3 py-2 text-xs font-bold text-mint transition-all hover:bg-mint/20 text-center flex items-center justify-center"
      >
        Continue Learning
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick}
      className="w-full rounded-2xl bg-[#d6ff00] px-3 py-2 text-xs font-black text-[#08120f] transition-all hover:scale-[1.05] shadow-[0_5px_15px_rgba(214,255,0,0.1)] active:scale-95"
    >
      Enroll Now
    </button>
  );
}
