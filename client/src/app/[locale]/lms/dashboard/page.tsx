import DashboardRedirectClient from "./DashboardRedirectClient";

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }];
}

export default function LMSDashboardPage() {
  return <DashboardRedirectClient />;
}

