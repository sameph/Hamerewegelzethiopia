"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/PageComponents";
import clsx from "clsx";

interface Content {
  heroTag: string; heroTitle: string; heroSub: string;
  formTitle: string; firstName: string; lastName: string;
  emailLabel: string; phoneLabel: string; subject: string;
  message: string; placeholder: string; submit: string;
  infoTitle: string; address: string; phone: string;
  email: string; social: string; mapTitle: string;
  hoursTitle: string; hoursWeekday: string;
  hoursSaturday: string; hoursSunday: string;
}

function Label({ text, isAm }: { text: string; isAm: boolean }) {
  return (
    <label className={clsx("block mb-1.5", isAm ? "font-ethiopic text-[.78rem]" : "font-sans text-[.65rem] uppercase tracking-[.14em]")}
      style={{ color: "#111", fontWeight: "bold" }}>{text}</label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: ".75rem 1rem",
  background: "rgba(255,255,255,.88)", border: "1.5px solid rgba(27,27,27,.18)",
  borderRadius: 8, color: "#111", outline: "none",
  fontSize: ".9rem", transition: "border-color .2s, box-shadow .2s",
};

export default function ContactClient({ locale, c }: { locale: string; c: Content }) {
  const isAm = locale === "am";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", subject: "", message: "" });

  const heroImage = "/assets/herosection.png";
  const heroCardImage = "/assets/herosection.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: "linear-gradient(180deg, rgba(247,247,247,.94), rgba(227,239,38,.08))" }}>

      {/* Hero — same layout as Blog */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.82)_0%,rgba(7,12,9,0.52)_42%,rgba(7,12,9,0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(8,13,10,0.68))]" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-24 md:pt-28 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <Reveal>
              <p className={clsx("mb-4 text-[#d6ff00]", isAm ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.2em]")}>
                {isAm ? "ቤት • ያግኙን" : "Home • Contact"}
              </p>
              <h1 className={clsx("font-bold leading-[1.15] text-white", isAm ? "font-ethiopic text-[clamp(1.5rem,4vw,2.8rem)]" : "font-serif text-[clamp(1.8rem,4vw,3.3rem)]")}>
                {c.heroTitle}
              </h1>
              <p className={clsx("mt-6 max-w-xl text-white", isAm ? "font-ethiopic text-[0.94rem] leading-[1.9]" : "font-sans text-[0.95rem] leading-[1.9]")}>
                {c.heroSub}
              </p>
              <Link
                href="#contact-content"
                className={clsx("mt-8 inline-flex items-center gap-2 text-white hover:text-[#d6ff00] hover:gap-3 transition-all", isAm ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.78rem] uppercase tracking-[0.14em] font-semibold")}
              >
                {isAm ? "ፎርም ሙሉ" : "Get in Touch"} <ArrowRight size={14} />
              </Link>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative h-[300px] sm:h-[360px] lg:h-[400px]">
                <div className="absolute -right-4 -top-4 md:-right-6 md:-top-6 w-[55%] h-[92%] bg-[linear-gradient(180deg,#d6ff00_0%,#a6ff4d_45%,#79b93f_100%)]" />
                <div className="absolute inset-x-0 top-7 sm:top-10 h-[78%] home-glass-panel shadow-[0_24px_55px_rgba(39,69,20,0.25)] overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroCardImage}')` }} />
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(15,27,20,0.2))]" />
                  <div className="absolute left-4 bottom-4 rounded-full px-3 py-1 text-[11px] tracking-[0.12em] uppercase bg-white/75 text-[#1e2012] font-semibold">
                    {c.heroTag}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section id="contact-content" style={{ padding: "5rem 2.5rem 6rem" }}>
        <div className="contact-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

          {/* Form card */}
          <Reveal direction="left">
            <div style={{ background: "linear-gradient(180deg, rgba(214,255,0,.1), rgba(166,255,77,.07))", borderRadius: 20, padding: "2.5rem", border: "1.5px solid rgba(166,255,77,.22)", boxShadow: "0 18px 40px rgba(27,27,27,.08)" }}>
              <h2 className={clsx("font-serif font-semibold mb-6", isAm && "font-ethiopic")}
                style={{ fontSize: "1.6rem", color: "#111", fontWeight: "bold" }}>{c.formTitle}</h2>

              {sent ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                  <p className={clsx("font-serif font-semibold", isAm && "font-ethiopic")}
                    style={{ fontSize: "1.2rem", color: "#111" }}>
                    {isAm ? "መልእክትዎ ተልኳል!" : "Message sent successfully!"}
                  </p>
                  <p className={clsx("mt-2", isAm ? "font-ethiopic text-[.82rem]" : "font-sans text-[.84rem]")}
                    style={{ color: "#555" }}>
                    {isAm ? "በቅርብ ጊዜ ውስጥ እናቀርብሎታለን።" : "We will get back to you shortly."}
                  </p>
                  <button onClick={() => setSent(false)}
                    className={clsx("mt-5", isAm ? "font-ethiopic text-[.8rem]" : "font-sans text-[.7rem] uppercase tracking-[.1em]")}
                    style={{ color: "#111", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                    {isAm ? "ሌላ ይላኩ" : "Send another"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
                    <div>
                      <Label text={c.firstName} isAm={isAm} />
                      <input value={form.first} onChange={e => setForm({ ...form, first: e.target.value })}
                        style={{ ...inputStyle }} required
                        onFocus={e => { e.target.style.borderColor = "#A6FF4D"; e.target.style.boxShadow = "0 0 0 3px rgba(166,255,77,.14)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(27,27,27,.18)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                    <div>
                      <Label text={c.lastName} isAm={isAm} />
                      <input value={form.last} onChange={e => setForm({ ...form, last: e.target.value })}
                        style={{ ...inputStyle }} required
                        onFocus={e => { e.target.style.borderColor = "#A6FF4D"; e.target.style.boxShadow = "0 0 0 3px rgba(166,255,77,.14)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(27,27,27,.18)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </div>

                  {[
                    { key: "email", label: c.emailLabel, type: "email", field: "email" as const },
                    { key: "phone", label: c.phoneLabel, type: "tel",   field: "phone" as const },
                  ].map(({ key, label, type, field }) => (
                    <div key={key} style={{ marginBottom: "1.2rem" }}>
                      <Label text={label} isAm={isAm} />
                      <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                        style={{ ...inputStyle }}
                        onFocus={e => { e.target.style.borderColor = "#A6FF4D"; e.target.style.boxShadow = "0 0 0 3px rgba(166,255,77,.14)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(27,27,27,.18)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: "1.2rem" }}>
                    <Label text={c.subject} isAm={isAm} />
                    <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      style={{ ...inputStyle }} required
                      onFocus={e => { e.target.style.borderColor = "#A6FF4D"; e.target.style.boxShadow = "0 0 0 3px rgba(166,255,77,.14)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(27,27,27,.18)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.8rem" }}>
                    <Label text={c.message} isAm={isAm} />
                    <textarea
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={c.placeholder} rows={4} required
                      className={clsx(isAm ? "font-ethiopic text-[.86rem]" : "")}
                      style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "inherit" }}
                      onFocus={e => { e.target.style.borderColor = "#A6FF4D"; e.target.style.boxShadow = "0 0 0 3px rgba(166,255,77,.14)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(27,27,27,.18)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  <button type="submit"
                    className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.8rem] uppercase tracking-[.12em]")}
                    style={{ width: "100%", padding: "1rem", borderRadius: 10, background: "#d6ff00", color: "#17351f", border: "none", cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 24px rgba(166,255,77,0.35)", transition: "all .25s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#a6ff4d"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#d6ff00"; e.currentTarget.style.transform = "none"; }}>
                    {c.submit} →
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info card */}
          <Reveal direction="right">
            <div style={{ background: "linear-gradient(180deg, rgba(214,255,0,.1), rgba(166,255,77,.07))", borderRadius: 20, padding: "2.5rem", border: "1.5px solid rgba(166,255,77,.22)", boxShadow: "0 18px 40px rgba(27,27,27,.08)" }}>
              <h2 className={clsx("font-serif font-semibold mb-6", isAm && "font-ethiopic")}
                style={{ fontSize: "1.6rem", color: "#111" }}>{c.infoTitle}</h2>

              {[
                { icon: "📍", text: c.address },
                { icon: "📞", text: c.phone },
                { icon: "✉",  text: c.email },
                { icon: "📱", text: c.social },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".9rem", marginBottom: "1.2rem" }}>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <p className={clsx(isAm ? "font-ethiopic text-[.86rem]" : "font-sans text-[.9rem]")}
                    style={{ color: "#333", lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}

              <div style={{ height: 1, background: "rgba(166,255,77,.25)", margin: "2rem 0" }} />

              <h3 className={clsx("font-serif font-semibold mb-4", isAm && "font-ethiopic")}
                style={{ fontSize: "1.1rem", color: "#111" }}>{c.hoursTitle}</h3>
              {[c.hoursWeekday, c.hoursSaturday, c.hoursSunday].map((h, i) => (
                <p key={i} className={clsx(isAm ? "font-ethiopic text-[.8rem]" : "font-sans text-[.84rem]")}
                  style={{ color: "#444", marginBottom: ".5rem", lineHeight: 1.5 }}>{h}</p>
              ))}

              <div style={{ height: 1, background: "rgba(166,255,77,.25)", margin: "2rem 0" }} />

              <h3 className={clsx("font-serif font-semibold mb-4", isAm && "font-ethiopic")}
                style={{ fontSize: "1.1rem", color: "#111" }}>{c.mapTitle}</h3>
              <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(27,27,27,.12)", border: "1px solid rgba(166,255,77,.2)" }}>
                <svg viewBox="0 0 320 200" style={{ width: "100%", background: "linear-gradient(135deg, #1B1B1B, #17351f, #1B1B1B)", display: "block" }}>
                  <path d="M120 40 Q155 30 185 50 Q210 65 215 90 Q220 115 205 140 Q190 165 165 170 Q140 175 115 160 Q90 145 85 120 Q80 95 90 70 Z" fill="rgba(166,255,77,.1)" stroke="rgba(166,255,77,.22)" strokeWidth="1" />
                  <line x1="155" y1="100" x2="220" y2="80" stroke="rgba(214,255,0,.18)" strokeWidth=".8" strokeDasharray="3 2" />
                  <line x1="155" y1="100" x2="100" y2="140" stroke="rgba(214,255,0,.18)" strokeWidth=".8" strokeDasharray="3 2" />
                  <line x1="155" y1="100" x2="170" y2="160" stroke="rgba(214,255,0,.18)" strokeWidth=".8" strokeDasharray="3 2" />
                  <circle cx="155" cy="100" r="12" fill="rgba(214,255,0,.14)" />
                  <circle cx="155" cy="100" r="7" fill="rgba(214,255,0,.28)" />
                  <circle cx="155" cy="100" r="4" fill="#D6FF00" />
                  <circle cx="155" cy="100" r="1.5" fill="#fff" opacity=".8" />
                  <rect x="125" y="112" width="60" height="14" rx="3" fill="rgba(27,27,27,.75)" />
                  <text x="155" y="122.5" textAnchor="middle" fontSize="6" fill="#D6FF00" fontFamily="DM Sans, sans-serif">Bole, Addis Ababa</text>
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
