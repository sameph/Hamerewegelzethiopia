"use client";

import { useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

interface Content {
  welcome: string;
  stats: {
    enrolled: string;
    completed: string;
    pending: string;
  };
  recentActivity: string;
  continueLearning: string;
}

export default memo(function LMSDashboardClient({ locale, c }: { locale: string; c: Content }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isAm = locale === "am";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/lms`);
    }
  }, [user, isLoading, router, locale]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const name = user.email.split('@')[0];

  return (
    <div style={{ background: "var(--light-bg)", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Welcome Card */}
        <div style={{ background: "linear-gradient(140deg, color-mix(in srgb, var(--color-accent-bright) 55%, transparent), color-mix(in srgb, var(--color-primary-light) 42%, transparent))", borderRadius: 20, padding: "2rem", border: "1px solid color-mix(in srgb, var(--charcoal) 8%, transparent)", marginBottom: "2rem", boxShadow: "0 18px 40px color-mix(in srgb, var(--charcoal) 8%, transparent)" }}>
          <h1 className={clsx("font-serif font-semibold text-[var(--charcoal)]", isAm && "font-ethiopic")}>
            {c.welcome.replace('{name}', name)}
          </h1>
          <p className={clsx(isAm ? "font-ethiopic text-[.88rem]" : "font-sans text-[.96rem]")}
            style={{ color: "color-mix(in srgb, var(--muted) 82%, transparent)", marginTop: "0.5rem" }}>
            {isAm ? "የትምህርት ሂደትዎን እንደገና ለመጀመር ያስቡ።" : "Ready to continue your learning journey."}
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "var(--color-primary-light)", borderRadius: 15, padding: "1.5rem", border: "1px solid color-mix(in srgb, var(--charcoal) 8%, transparent)" }}>
            <h3 className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.8rem] uppercase tracking-[.1em]")}
              style={{ color: "var(--charcoal)", marginBottom: "0.5rem" }}>{c.stats.enrolled}</h3>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--charcoal)" }}>5</p>
          </div>
          <div style={{ background: "var(--color-primary-light)", borderRadius: 15, padding: "1.5rem", border: "1px solid color-mix(in srgb, var(--charcoal) 8%, transparent)" }}>
            <h3 className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.8rem] uppercase tracking-[.1em]")}
              style={{ color: "var(--charcoal)", marginBottom: "0.5rem" }}>{c.stats.completed}</h3>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--charcoal)" }}>2</p>
          </div>
          <div style={{ background: "var(--color-primary-light)", borderRadius: 15, padding: "1.5rem", border: "1px solid color-mix(in srgb, var(--charcoal) 8%, transparent)" }}>
            <h3 className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.8rem] uppercase tracking-[.1em]")}
              style={{ color: "var(--charcoal)", marginBottom: "0.5rem" }}>{c.stats.pending}</h3>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--charcoal)" }}>3</p>
          </div>
        </div>

        {/* Course Progress */}
        <div style={{ background: "var(--card-white)", borderRadius: 20, padding: "2rem", border: "1px solid color-mix(in srgb, var(--charcoal) 8%, transparent)", boxShadow: "0 4px 20px color-mix(in srgb, var(--charcoal) 5%, transparent)" }}>
          <h2 className={clsx("font-serif font-semibold mb-6", isAm && "font-ethiopic")}
            style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--charcoal)" }}>
            {c.continueLearning}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {[
              { title: "Introduction to Theology", progress: 75 },
              { title: "Biblical Studies", progress: 45 },
              { title: "Church History", progress: 90 }
            ].map((course, i) => (
              <div key={i} style={{ background: "var(--light-bg)", borderRadius: 10, padding: "1.5rem", border: "1px solid color-mix(in srgb, var(--charcoal) 8%, transparent)" }}>
                <h4 className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.9rem]")}
                  style={{ color: "var(--charcoal)", marginBottom: "0.5rem" }}>{course.title}</h4>
                <div style={{ width: "100%", height: 8, background: "color-mix(in srgb, var(--charcoal) 10%, transparent)", borderRadius: 4, overflow: "hidden", marginBottom: "0.5rem" }}>
                  <div style={{ width: `${course.progress}%`, height: "100%", background: "linear-gradient(90deg,var(--color-accent-bright),var(--color-primary))", borderRadius: 4 }}></div>
                </div>
                <p style={{ fontSize: ".8rem", color: "var(--color-primary)" }}>{course.progress}% Complete</p>
                <button style={{ marginTop: "1rem", padding: ".5rem 1rem", background: "var(--color-primary-light)", color: "var(--charcoal)", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, transition: "all .3s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 20px color-mix(in srgb, var(--color-accent-bright) 60%, transparent)"; e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}>
                  {c.continueLearning}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});