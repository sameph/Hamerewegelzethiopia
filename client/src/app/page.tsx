import { redirect } from "next/navigation";

// Root page — redirect to default locale (English)
export default function RootPage() {
  redirect("/en");
}
