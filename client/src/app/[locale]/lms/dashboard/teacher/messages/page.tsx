import { Suspense } from "react";
import MessagesPage from "@/components/lms/shared/MessagesPage";

export const metadata = {
  title: "Messages | Teacher Dashboard | Saint Cyril College LMS",
  description: "Private and group communications",
};

export default function TeacherMessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <MessagesPage />
    </Suspense>
  );
}
