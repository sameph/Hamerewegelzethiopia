import CertificatesClient from "@/components/lms/student/CertificatesClient";

export const metadata = {
  title: "Certificates | Student Dashboard | Hamere Wengel LMS",
  description: "View your earned certificates and progress",
};

export default function StudentCertificatesPage() {
  return <CertificatesClient />;
}