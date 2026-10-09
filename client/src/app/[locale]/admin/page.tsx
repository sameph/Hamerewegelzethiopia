import { redirect } from "next/navigation";

export default function AdminHomeRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/admin/dashboard`);
}
