import { redirect } from "next/navigation";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function EducationLibraryBookPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = (await Promise.resolve(params)) as { locale: Locale };
  redirect(`/${locale}/library`);
}
