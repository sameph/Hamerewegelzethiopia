import DashboardRoleClient from "./DashboardRoleClient";

export function generateStaticParams() {
  const roles = ["student", "teacher"];
  const locales = ["en", "am"];
  const params = [];
  for (const locale of locales) {
    for (const role of roles) {
      params.push({ locale, role });
    }
  }
  return params;
}

export default function LMSDashboardRolePage({ params }: { params: { role: string } }) {
  return <DashboardRoleClient role={params.role} />;
}

