import TeacherDashboardModule from "@/components/lms/teacher/TeacherDashboardModule";

export const metadata = {
  title: "Teacher Dashboard | Saint Cyril College LMS",
  description: "Teaching overview including classes, submissions, and schedule",
};

export default function TeacherDashboardPage() {
  return <TeacherDashboardModule teacherName="Pastor Samuel" />;
}
