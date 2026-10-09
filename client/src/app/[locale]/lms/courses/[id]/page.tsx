import CourseClient from "./CourseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchCourseIds() {
  try {
    const res = await fetch(`${API_URL}/courses`, { cache: "force-cache" });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) return [];
    return data.data
      .map((course: any) => course._id || course.id)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const defaultCourseIds = ["bible-101", "history-faith", "leadership"];
  const backendCourseIds = await fetchCourseIds();
  const courseIds = Array.from(
    new Set([...defaultCourseIds, ...backendCourseIds])
  );
  const locales = ["en", "am"];
  const params: Array<{ locale: string; id: string }> = [];

  for (const locale of locales) {
    for (const id of courseIds) {
      params.push({ locale, id });
    }
  }
  return params;
}

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CourseClient id={params.id} />;
}
