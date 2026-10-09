import ResetPasswordForm from "./ResetPasswordForm";

export function generateStaticParams() {
  return [
    { locale: "en", token: "sample" },
    { locale: "am", token: "sample" },
  ];
}

export default function ResetPasswordPage({
  params,
}: {
  params: { locale: string; token: string };
}) {
  return <ResetPasswordForm locale={params.locale} token={params.token} />;
}
