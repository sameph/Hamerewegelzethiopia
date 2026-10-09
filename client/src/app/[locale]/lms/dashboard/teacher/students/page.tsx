import StudentTable from "@/components/lms/teacher/StudentTable";

export const metadata = {
  title: "Students | Teacher Dashboard | Saint Cyril College LMS",
  description: "Monitor student progress and performance",
};

export default function TeacherStudentsPage() {
  return <StudentTable />;
}
