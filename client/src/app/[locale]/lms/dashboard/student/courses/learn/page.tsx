"use client";

import { Suspense } from "react";
import CourseLearningPage from "@/components/lms/student/CourseLearningPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <CourseLearningPage />
    </Suspense>
  );
}
