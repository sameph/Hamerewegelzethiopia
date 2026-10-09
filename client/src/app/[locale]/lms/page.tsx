import { redirect } from "next/navigation";

export default function LMSIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/lms/login`);
}
