import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["am", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "am";

  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
