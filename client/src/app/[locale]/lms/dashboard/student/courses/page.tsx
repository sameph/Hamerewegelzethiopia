import CoursesClient from "@/components/lms/student/CoursesClient";

export const metadata = {
  title: "Courses | Student Dashboard | Hamere Wengel LMS",
  description: "View your enrolled and available courses",
};

export default function StudentCoursesPage() {
  return <CoursesClient />;
}