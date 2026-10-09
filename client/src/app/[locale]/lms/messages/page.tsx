import MessagesClient from "@/components/lms/student/MessagesClient";

export const metadata = {
  title: "Messages | Student Dashboard | Hamere Wengel LMS",
  description: "Chat with instructors and view announcements",
};

export default function MessagesPage() {
  return <MessagesClient />;
}
