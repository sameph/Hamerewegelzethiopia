import ClassesClient from "@/components/lms/student/ClassesClient";

export const metadata = {
  title: "Classes | Student Dashboard | Hamere Wengel LMS",
  description: "Manage your live classes and recorded sessions",
};

export default function StudentClassesPage() {
  return <ClassesClient />;
}