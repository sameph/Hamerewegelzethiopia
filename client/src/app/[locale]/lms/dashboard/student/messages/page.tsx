import { Suspense } from "react";
import MessagesPage from "@/components/lms/shared/MessagesPage";

export const metadata = {
  title: "Messages | Student Dashboard | Saint Cyril College LMS",
  description: "Connect with instructors and peers",
};

export default function StudentMessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <MessagesPage />
    </Suspense>
  );
}
