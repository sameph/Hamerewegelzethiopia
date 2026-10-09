export type LessonType = "video" | "document" | "reading";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  completed: boolean;
  resources: string[];
}

export interface Course {
  _id?: string;
  id: string;
  title: string;
  category: string;
  instructor: string | { _id: string; username: string };
  description: string;
  outcomes: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessonsCount?: number;
  progress: number;
  enrolled: boolean;
  isRecentCourse?: boolean;
  isPopular?: boolean;
  price?: number;
  currency?: string;
  enrolledStudents?: string[];
  thumbnail: string;
  lessons: Lesson[];
}

export const courses: Course[] = [];

export function findCourseById(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function enrolledCourses() {
  return courses.filter((course) => course.enrolled);
}

export function availableCourses() {
  return courses.filter((course) => !course.enrolled);
}
