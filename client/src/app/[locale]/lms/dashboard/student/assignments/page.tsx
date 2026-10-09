import AssignmentsClient from "@/components/lms/student/AssignmentsClient";

export const metadata = {
  title: "Assignments | Student Dashboard | Hamere Wengel LMS",
  description: "Manage your assignments and submissions",
};

export default function StudentAssignmentsPage() {
  return <AssignmentsClient />;
}