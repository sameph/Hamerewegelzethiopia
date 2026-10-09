import AdminDashboard from "@/components/admin/AdminDashboard";

export function generateStaticParams() {
  const sections = [
    "dashboard", "admissions", "students", "teachers", "courses", "library",
    "sermons", "news-articles", "settings"
  ];
  const params: { locale: string; section: string }[] = [];
  ["en", "am"].forEach(locale => {
    sections.forEach(section => params.push({ locale, section }));
  });
  return params;
}

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  return <AdminDashboard section={params.section} />;
}

