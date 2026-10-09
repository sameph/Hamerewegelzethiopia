import CourseManager from "@/components/lms/teacher/CourseManager";

export const metadata = {
  title: "My Courses | Teacher Dashboard | Saint Cyril College LMS",
  description: "Create, edit, publish and manage courses",
};

export default function TeacherCoursesPage() {
  return <CourseManager />;
}
