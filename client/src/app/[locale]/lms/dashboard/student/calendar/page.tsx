import CalendarClient from "@/components/lms/student/CalendarClient";

export const metadata = {
  title: "Calendar | Student Dashboard | Hamere Wengel LMS",
  description: "View your classes, events, deadlines, and academic schedule",
};

export default function StudentCalendarPage() {
  return <CalendarClient />;
}