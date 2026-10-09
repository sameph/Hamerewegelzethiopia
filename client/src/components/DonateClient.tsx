"use client";

import { useState } from "react";
import { Reveal } from "@/components/PageComponents";
import clsx from "clsx";

interface Content {
  heroTag: string; heroTitle: string; heroSub: string;
  amountLabel: string; customLabel: string;
  freqs: string[]; intlTitle: string; localTitle: string;
  causes: { title: string; desc: string; amount: string }[];
  methodsTitle: string;
  btnDonate: string; secureNote: string;
  stripeLabel: string; paypalLabel: string;
  telebirrLabel: string; chapaLabel: string;
}

// Admin-configurable donation causes (prices set via admin portal)
const DONATION_CAUSES = [
  { am: "የወንጌል ልዑካን ቀለብ ድጋፍ",  en: "Evangelists' Stipend Support",    icon: "📢", amount: "ETB 500" },
  { am: "የተማሪ ስፖንሰር ሺፕ ድጋፍ",   en: "Student Sponsorship Support",      icon: "🎓", amount: "ETB 1,200" },
  { am: "የመጽሐፍ ቅዱስ ድጋፍ",         en: "Bible Provision Support",           icon: "📖", amount: "ETB 150" },
  { am: "የመልሶ ማቋቋሚያ ድጋፍ",       en: "Rehabilitation Support",             icon: "🏥", amount: "ETB 2,000" },
  { am: "የአጋዥ መጻሕፍት ድጋፍ",       en: "Reference Books Support",            icon: "📚", amount: "ETB 300" },
];

export default function DonateClient({ locale, c }: { locale: string; c: Content }) {
  const isAm = locale === "am";
  const heroImage = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1600&auto=format&fit=crop";
  const [activeFreq, setActiveFreq] = useState(0);
  const [activeCause, setActiveCause] = useState(0);
  const [custom, setCustom] = useState("");
  const [tab, setTab] = useState<"intl" | "local">("intl");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.84)_0%,rgba(7,12,9,0.58)_42%,rgba(7,12,9,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(8,13,10,0.68))]" />
        <div className="relative mx-auto max-w-6xl px-6 md:px-10 pt-24 md:pt-28 pb-14 md:pb-16">
          <p className={clsx("mb-4 text-[#d6ff00]", isAm ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.2em]")}>{c.heroTag}</p>
          <h1 className={clsx("font-bold leading-[1.15] text-white", isAm ? "font-ethiopic text-[clamp(1.5rem,4vw,2.8rem)]" : "font-serif text-[clamp(1.8rem,4vw,3.3rem)]")}>{c.heroTitle}</h1>
          <p className={clsx("mt-6 max-w-2xl text-white", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>{c.heroSub}</p>
        </div>
      </section>

      <section style={{ background: "#F7F7F7", padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Cause overview cards */}
          <Reveal>
            <h2 className={clsx("font-serif font-semibold mb-6", isAm && "font-ethiopic")}
              style={{ fontSize: "clamp(1.4rem,2.5vw,1.9rem)", color: "#1B1B1B" }}>
              {isAm ? "ድጋፍ ዓላማዎች" : "Donation Causes"}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.2rem", marginBottom: "4rem" }}>
            {DONATION_CAUSES.map((cause, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "1.6rem", border: "1.5px solid transparent", transition: "all .3s", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(166,255,77,.5)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(27,27,27,.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                  <span style={{ fontSize: "2rem", marginBottom: ".8rem", opacity: .75 }}>{cause.icon}</span>
                  <p className="font-ethiopic font-semibold" style={{ fontSize: ".95rem", color: "#1B1B1B", marginBottom: ".2rem" }}>{cause.am}</p>
                  <p className="font-sans" style={{ fontSize: ".78rem", color: "#555", marginBottom: "1rem", flex: 1 }}>{cause.en}</p>
                  <div style={{ paddingTop: ".6rem", borderTop: "1px solid rgba(27,27,27,.08)" }}>
                    <span className="font-sans font-semibold" style={{ fontSize: ".85rem", color: "#17351f" }}>{cause.amount}</span>
                    <span className="font-sans" style={{ fontSize: ".65rem", color: "#999", marginLeft: ".4rem" }}>
                      {isAm ? "ተጠቃሚ" : "suggested"}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Donation form */}
          <Reveal delay={0.12}>
            <div style={{ maxWidth: 660, margin: "0 auto", background: "linear-gradient(135deg, #1B1B1B, #1B1B1B)", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(0,208,132,.12)", boxShadow: "0 20px 60px rgba(27,27,27,.25)" }}>

              {/* International / Local tab */}
              <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,208,132,.2)", marginBottom: "1.6rem" }}>
                {[{ key: "intl" as const, label: c.intlTitle }, { key: "local" as const, label: c.localTitle }].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={clsx(isAm ? "font-ethiopic text-[.8rem]" : "font-sans text-[.7rem] uppercase tracking-[.08em]")}
                    style={{ flex: 1, padding: ".65rem", border: "none", cursor: "pointer", transition: "all .2s", fontWeight: 600,
                      background: tab === t.key ? "#1B1B1B" : "transparent",
                      color: tab === t.key ? "#F7F7F7" : "rgba(247,247,247,.45)" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Frequency */}
              <p className={clsx("mb-2", isAm ? "font-ethiopic text-[.76rem]" : "font-sans text-[.62rem] uppercase tracking-[.14em]")}
                style={{ color: "rgba(247,247,247,.48)" }}>{c.amountLabel}</p>
              <div style={{ display: "flex", gap: ".5rem", marginBottom: "1.4rem" }}>
                {c.freqs.map((f, i) => (
                  <button key={i} onClick={() => setActiveFreq(i)}
                    className={clsx(isAm ? "font-ethiopic text-[.78rem]" : "font-sans text-[.68rem] uppercase tracking-[.08em]")}
                    style={{ flex: 1, padding: ".5rem 0", borderRadius: 8, cursor: "pointer", transition: "all .2s", fontWeight: 600,
                      background: activeFreq === i ? "#1B1B1B" : "transparent",
                      border: `1px solid ${activeFreq === i ? "#00D084" : "rgba(0,208,132,.2)"}`,
                      color: activeFreq === i ? "#F7F7F7" : "rgba(247,247,247,.5)" }}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Cause selection (replaces dollar amount grid) */}
              <p className={clsx("mb-2", isAm ? "font-ethiopic text-[.76rem]" : "font-sans text-[.62rem] uppercase tracking-[.14em]")}
                style={{ color: "rgba(247,247,247,.48)" }}>
                {isAm ? "ድጋፍ ዓላማ ይምረጡ" : "Select Donation Cause"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", marginBottom: "1.1rem" }}>
                {DONATION_CAUSES.map((cause, i) => (
                  <button key={i} onClick={() => { setActiveCause(i); setCustom(""); }}
                    style={{ padding: ".7rem 1rem", borderRadius: 10, cursor: "pointer", transition: "all .2s",
                      textAlign: "left", display: "flex", alignItems: "center", gap: ".75rem",
                      background: activeCause === i && !custom ? "rgba(0,208,132,.1)" : "transparent",
                      border: `1px solid ${activeCause === i && !custom ? "#00D084" : "rgba(0,208,132,.2)"}`,
                      color: "#F7F7F7" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{cause.icon}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="font-ethiopic block" style={{ fontSize: ".8rem", fontWeight: activeCause === i && !custom ? 700 : 500 }}>{cause.am}</span>
                      <span className="font-sans block" style={{ fontSize: ".68rem", color: "rgba(247,247,247,.5)", marginTop: ".1rem" }}>{cause.en}</span>
                    </span>
                    <span className="font-sans" style={{ fontSize: ".68rem", color: activeCause === i && !custom ? "#00D084" : "rgba(247,247,247,.32)", flexShrink: 0 }}>
                      {cause.amount}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <input type="text" value={custom} onChange={e => { setCustom(e.target.value); }}
                placeholder={`ETB / $ — ${c.customLabel}`}
                className={clsx(isAm ? "font-ethiopic text-[.86rem]" : "font-sans text-[.86rem]")}
                style={{ width: "100%", padding: ".7rem 1rem", borderRadius: 8, border: `1px solid ${custom ? "#00D084" : "rgba(0,208,132,.2)"}`, background: custom ? "rgba(27,27,27,.3)" : "rgba(255,255,255,.05)", color: "#F7F7F7", outline: "none", marginBottom: "1.4rem", transition: "all .2s" }}
              />

              {/* Payment methods */}
              <p className={clsx("mb-3", isAm ? "font-ethiopic text-[.74rem]" : "font-sans text-[.62rem] uppercase tracking-[.14em]")}
                style={{ color: "rgba(247,247,247,.38)" }}>{c.methodsTitle}</p>

              {tab === "intl" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: "1.4rem" }}>
                  {[{ icon: "💳", label: c.stripeLabel }, { icon: "🅿", label: c.paypalLabel }].map((m, i) => (
                    <button key={i}
                      className={clsx(isAm ? "font-ethiopic text-[.82rem]" : "font-sans text-[.78rem]")}
                      style={{ padding: ".75rem", borderRadius: 10, border: "1px solid rgba(0,208,132,.2)", background: "rgba(255,255,255,.04)", color: "#F7F7F7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", transition: "all .2s", fontWeight: 600 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#00D084"; e.currentTarget.style.background = "rgba(0,208,132,.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,208,132,.2)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: "1.4rem" }}>
                  {[{ icon: "📱", label: c.telebirrLabel }, { icon: "🇪🇹", label: c.chapaLabel }].map((m, i) => (
                    <button key={i}
                      className={clsx(isAm ? "font-ethiopic text-[.82rem]" : "font-sans text-[.78rem]")}
                      style={{ padding: ".75rem", borderRadius: 10, border: "1px solid rgba(0,208,132,.2)", background: "rgba(255,255,255,.04)", color: "#F7F7F7", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", transition: "all .2s", fontWeight: 600 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#00D084"; e.currentTarget.style.background = "rgba(0,208,132,.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,208,132,.2)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Donate button */}
              <button className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.8rem] uppercase tracking-[.12em]")}
                style={{ width: "100%", padding: "1rem", borderRadius: 10, background: "#d6ff00", color: "#17351f", border: "none", cursor: "pointer", fontWeight: 700, boxShadow: "0 0 28px rgba(166,255,77,0.5)", transition: "all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#a6ff4d"; e.currentTarget.style.boxShadow = "0 0 42px rgba(166,255,77,0.65)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#d6ff00"; e.currentTarget.style.boxShadow = "0 0 28px rgba(166,255,77,0.5)"; e.currentTarget.style.transform = "none"; }}>
                ❤ {c.btnDonate}
              </button>
              <p className="font-sans text-[.6rem] text-center mt-3" style={{ color: "rgba(247,247,247,.28)" }}>🔒 {c.secureNote}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
