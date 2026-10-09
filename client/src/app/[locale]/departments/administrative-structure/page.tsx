import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import HomeFooter from "@/components/home/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import DepartmentHero from "@/components/DepartmentHero";
import HierarchyTree from "@/components/HierarchyTree";
import InfoCard from "@/components/InfoCard";
import CTASection from "@/components/CTASection";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

const hierarchyLevels = [
  { title: "Headquarters (HQ)", icon: "🏢", description: "Central decision-making office that sets strategy, policy, and operational direction for the entire ministry." },
  { title: "Diocese", icon: "⛪", description: "Regional leadership tier providing guidance and support to zone directors and ensuring mission alignment." },
  { title: "Zone", icon: "📍", description: "A collection of districts coordinating training, finance, and program rollout across local areas." },
  { title: "District", icon: "🏘️", description: "Supervises Wereda offices, tracks goals, and delivers localized training and resources." },
  { title: "Wereda", icon: "🌱", description: "Grassroots team at district level that connects local churches, schools, and outreach efforts." },
];

const roles = [
  { icon: "👤", title: "HQ Administration", description: "Strategy, policy, finance, and national-level program oversight." },
  { icon: "👥", title: "Diocese Leaders", description: "Regional coordination, compliance, and resource allocation for zones." },
  { icon: "🔧", title: "Zone Managers", description: "Implementation of projects, capacity-building, and performance monitoring." },
  { icon: "🏛️", title: "District Coordinators", description: "Site visit planning, local coaching, and operational support for Wereda offices." },
  { icon: "📊", title: "Wereda Teams", description: "Community engagement, beneficiary follow-up, and local reporting." },
];

export default async function AdministrativeStructure({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale: rawLocale } = await Promise.resolve(params);
  const locale = rawLocale === "en" ? rawLocale : "en";

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="bg-gradient-to-b from-[#F7F7F7] to-[#F7F7F7]">
          <DepartmentHero
            title="Administrative Structure"
            subtitle="Full hierarchical structure from HQ to local Wereda offices"
          />

          <section className="mx-auto max-w-6xl px-4 py-10 text-[#1B1B1B]">
            <h2 className="text-3xl font-bold">Structure Overview</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#333333]/80">
              The ministry is organized in a tiered model to ensure accountability and support at every level. Starting from the central headquarters, every layer is designed
              to provide effective resource distribution, monitoring, and capacity building to local communities through dioceses, zones, districts, and Weredas.
            </p>
          </section>

          <section className="bg-white/40 py-8 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-[#1B1B1B]">Hierarchy Structure</h2>
              <p className="mt-2 max-w-3xl text-sm text-[#333333]/72">A clear chain of command that delivers consistent ministry support from national leadership to local outreach.</p>
            </div>
            <HierarchyTree levels={hierarchyLevels} />
          </section>

          <section className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-3xl font-bold text-[#1B1B1B]">Roles & Responsibilities</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((roleItem) => (
                <InfoCard
                  key={roleItem.title}
                  icon={roleItem.icon}
                  title={roleItem.title}
                  description={roleItem.description}
                />
              ))}
            </div>
          </section>

          <CTASection onContactHref={`/${locale}/contact`} onFullStructureHref={`/${locale}/departments/administrative-structure`} />
        </main>
      </LocaleFadeWrapper>
      <HomeFooter locale={locale} />
    </LanguageProvider>
  );
}
