import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import { DEPARTMENTS } from "@/data/departments";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  const departmentSlugs = DEPARTMENTS.map(dept => dept.slug);
  return departmentSlugs.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "am", slug },
  ]);
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }> | { locale: string; slug: string };
}) {
  const { locale, slug } = (await Promise.resolve(params)) as { locale: Locale; slug: string };
  const department = DEPARTMENTS.find((item) => item.slug === slug);
  const departmentsHeroImage =
    "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=1600&auto=format&fit=crop";
  const primaryButtonClass =
    "inline-flex items-center gap-2 rounded-full bg-[#d6ff00] px-7 py-3 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#a6ff4d]";
  const contactPerson = {
    name: department?.headName ?? "Dn. Samuel Tesfaye",
    role: department?.headRole ?? "Department Liaison Officer",
    email: "admin@hamerewengel.org",
    phone: "+251 11 123 4567",
    office: "Bole Sub-City, Addis Ababa, Ethiopia",
    availability: "Monday - Friday, 8:30 AM - 5:30 PM",
  };

  if (!department) {
    notFound();
  }

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="min-h-screen pb-16" style={{ background: "#1B1B1B" }}>
          <section className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${departmentsHeroImage}')` }} />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.84)_0%,rgba(7,12,9,0.58)_42%,rgba(7,12,9,0.82)_100%)]" />
            <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-28 md:pb-14 md:pt-32">
              <div
                className="rounded-3xl border border-white/12 p-8 backdrop-blur-xl md:p-10"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 0 35px rgba(0, 208, 255, 0.12)",
                }}
              >
                <h1 className="mt-1 text-3xl font-bold text-[#FFFDEE] md:text-5xl">{department.title}</h1>
                <p className="mt-2 text-lg text-[#9be9ff]">({department.amharic})</p>
                <p className="mt-6 max-w-4xl leading-relaxed text-white/90">{department.description}</p>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-8 grid max-w-6xl gap-5 px-4 lg:grid-cols-2">
            <article
              className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <h2 className="text-xl font-semibold text-[#FFFDEE]">Mission and Purpose</h2>
              <p className="mt-3 leading-relaxed text-white">{department.mission}</p>
            </article>

            <article
              className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <h2 className="text-xl font-semibold text-[#FFFDEE]">Activities and Services</h2>
              <ul className="mt-3 space-y-2 text-white">
                {department.activities.map((activity) => (
                  <li key={activity} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white">
                    {activity}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mx-auto mt-8 grid max-w-6xl gap-5 px-4 lg:grid-cols-2">
            <article
              className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <h2 className="text-xl font-semibold text-[#FFFDEE]">Contact Person</h2>
              <p className="mt-3 !text-white">For department questions, coordination, or updates, contact:</p>

              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 !text-white">
                <p className="!text-white"><span className="font-semibold !text-white">Name:</span> <span className="!text-white">{contactPerson.name}</span></p>
                <p className="!text-white"><span className="font-semibold !text-white">Role:</span> <span className="!text-white">{contactPerson.role}</span></p>
                <p className="!text-white">
                  <span className="font-semibold !text-white">Email:</span>{" "}
                  <a href={`mailto:${contactPerson.email}`} className="!text-white underline underline-offset-4 hover:!text-white/90">
                    {contactPerson.email}
                  </a>
                </p>
                <p className="!text-white">
                  <span className="font-semibold !text-white">Phone:</span>{" "}
                  <a href={`tel:${contactPerson.phone.replace(/\s+/g, "")}`} className="!text-white underline underline-offset-4 hover:!text-white/90">
                    {contactPerson.phone}
                  </a>
                </p>
                <p className="!text-white"><span className="font-semibold !text-white">Office:</span> <span className="!text-white">{contactPerson.office}</span></p>
                <p className="!text-white"><span className="font-semibold !text-white">Availability:</span> <span className="!text-white">{contactPerson.availability}</span></p>
              </div>
            </article>

            <article
              className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <h2 className="text-xl font-semibold text-[#FFFDEE]">Send Feedback</h2>
              <p className="mt-3 text-white/90">Share your feedback, suggestions, or concerns with the department team.</p>

              <form className="mt-4 space-y-3" action={`mailto:${contactPerson.email}`} method="post" encType="text/plain">
                <label className="block">
                  <span className="mb-1 block text-sm text-[#FFFDEE]">Full Name</span>
                  <input
                    type="text"
                    name="Full Name"
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-white/45 focus:border-[#9be9ff]/70"
                    placeholder="Your full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#FFFDEE]">Email</span>
                  <input
                    type="email"
                    name="Email"
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-white/45 focus:border-[#9be9ff]/70"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#FFFDEE]">Subject</span>
                  <input
                    type="text"
                    name="Subject"
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-white/45 focus:border-[#9be9ff]/70"
                    placeholder="Feedback subject"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#FFFDEE]">Message</span>
                  <textarea
                    name="Message"
                    required
                    rows={5}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-white/45 focus:border-[#9be9ff]/70"
                    placeholder="Write your feedback here..."
                  />
                </label>

                <button
                  type="submit"
                  className={primaryButtonClass}
                >
                  Send Feedback
                </button>
              </form>
            </article>
          </section>
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}
