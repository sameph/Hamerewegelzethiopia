"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherCalendarModule from "@/components/lms/teacher/TeacherCalendarModule";

export default function LMSCalendarPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("lmsAuth");
    if (!auth) router.replace("/lms/login");
  }, [router]);

  return <TeacherCalendarModule />;
}
