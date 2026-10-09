"use client";

import { useState } from "react";
import { CreditCard, Wallet, Smartphone, Globe, Heart, ArrowRight } from "lucide-react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";

const CAUSE_ICONS = ["🎓","📜","🌱"];
const AMOUNTS = ["$10","$25","$50","$100","$250","$500"];

interface C {
  heroTag: string; heroTitle: string; heroP: string;
  causesTitle: string; causes: { title: string; desc: string; amount: string }[];
  formTitle: string; freqs: string[];
  amountLabel: string; customLabel: string;
  intlTitle: string; localTitle: string;
  stripeDesc: string; paypalDesc: string;
  telebirrDesc: string; chapaDesc: string;
  btnDonate: string; secureNote: string;
  impactTitle: string; impacts: { val: string; label: string }[];
}

export default function DonateClient({ locale, c }: { locale: string; c: C }) {
  const isAm   = locale === "am";
  const [freq, setFreq]   = useState(0);
  const [amt,  setAmt]    = useState(3);
  const [custom, setCustom] = useState("");
  const serif = clsx("font-serif", isAm && "font-ethiopic");
  const body  = isAm ? "font-ethiopic" : "font-sans";

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-end pb-20 px-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B 40%,#1B1B1B 80%,#1B1B1B)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(0,208,132,.06) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute right-0 top-0 w-[40vw] h-full pointer-events-none opacity-15"
          style={{ background: "radial-gradient(ellipse at 80% 40%,#D6FF00,transparent 60%)" }} />
        <div className="relative z-10 max-w-4xl">
          <Reveal>
            <span className={clsx("inline-flex items-center gap-3 text-gold mb-5",
              isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.28em]")}>
              <span className="block w-8 h-px bg-gold flex-shrink-0" />{c.heroTag}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className={clsx("font-serif font-semibold text-white mb-5 leading-[1.08]",
              "text-[clamp(2.2rem,5vw,3.8rem)]", isAm && "font-ethiopic leading-[1.4]")}>{c.heroTitle}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className={clsx("text-mist/62 max-w-[52ch] leading-[1.85]",
              isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.96rem]")}>{c.heroP}</p>
          </Reveal>
        </div>
      </section>

      {/* ── IMPACT COUNTERS ── */}
      <section style={{ background: "#1B1B1B", borderTop: "1px solid rgba(0,208,132,.08)", borderBottom: "1px solid rgba(0,208,132,.08)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3">
          {c.impacts.map((imp, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="py-8 px-4 text-center border-r border-sage/8 last:border-r-0">
                <div className="font-serif text-[2.2rem] font-semibold text-gold leading-none mb-2">{imp.val}</div>
                <p className={clsx(body, "text-mist/42", isAm ? "text-[0.72rem]" : "text-[0.62rem]")}>{imp.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CAUSES ── */}
      <section className="py-28 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className={clsx(serif, "font-semibold text-deep text-[clamp(1.8rem,3vw,2.6rem)]")}>{c.causesTitle}</h2>
            <div className="w-14 h-[2px] bg-gradient-to-r from-forest to-transparent mx-auto mt-5 rounded-full" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {c.causes.map((cause, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div className="group flex flex-col h-full p-8 rounded-2xl border border-transparent
                  hover:border-forest/35 hover:shadow-[0_8px_40px_rgba(27,27,27,.1)] transition-all duration-300"
                  style={{ background: "#F7F7F7" }}>
                  <span className="text-3xl mb-5 opacity-75">{CAUSE_ICONS[i]}</span>
                  <h3 className={clsx(serif, "font-semibold text-deep mb-3 flex-1 leading-snug",
                    isAm ? "text-[0.98rem]" : "text-[1.1rem]")}>{cause.title}</h3>
                  <div className="w-8 h-[1.5px] bg-gold/50 rounded-full mb-4" />
                  <p className={clsx(body, "text-deep/62 leading-relaxed mb-5 flex-1",
                    isAm ? "text-[0.82rem]" : "text-[0.84rem]")}>{cause.desc}</p>
                  <div className="pt-4 border-t border-forest/10">
                    <span className={clsx("font-serif font-semibold text-forest", isAm ? "text-[0.95rem]" : "text-[1rem]")}>{cause.amount}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* DONATION FORM */}
          <Reveal direction="scale">
            <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(27,27,27,.25)]"
              style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B 55%,#1B1B1B)" }}>
              <div className="p-8 lg:p-10">
                <h3 className={clsx(serif, "font-semibold text-mist mb-7 text-[1.3rem]")}>{c.formTitle}</h3>

                {/* Frequency */}
                <div className="flex gap-2 mb-7">
                  {c.freqs.map((f, i) => (
                    <button key={i} onClick={() => setFreq(i)}
                      className={clsx("flex-1 py-2.5 rounded-xl border font-semibold transition-all duration-200",
                        isAm ? "font-ethiopic text-[0.75rem]" : "font-sans text-[0.65rem] uppercase tracking-[0.08em]",
                        freq === i
                          ? "border-sage bg-sage/15 text-sage"
                          : "border-sage/15 text-mist/40 hover:border-sage/35 hover:text-mist/65")}>
                      {f}
                    </button>
                  ))}
                </div>

                {/* Amounts */}
                <p className={clsx(body, "text-mist/45 mb-3", isAm ? "text-[0.74rem]" : "text-[0.62rem] uppercase tracking-[0.14em]")}>{c.amountLabel}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {AMOUNTS.map((a, i) => (
                    <button key={i} onClick={() => { setAmt(i); setCustom(""); }}
                      className={clsx("py-2.5 rounded-xl border font-semibold font-sans transition-all duration-200",
                        amt === i && !custom
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-sage/15 text-mist/40 hover:border-sage/35 hover:text-mist/65")}>
                      {a}
                    </button>
                  ))}
                </div>
                <input type="text" value={custom} onChange={e => { setCustom(e.target.value); setAmt(-1); }}
                  placeholder={`$ ${c.customLabel}`}
                  className={clsx("w-full px-4 py-3 rounded-xl border outline-none transition-all mb-7",
                    "placeholder:text-mist/30 text-mist",
                    isAm ? "font-ethiopic text-[0.88rem]" : "font-sans text-[0.88rem]",
                    custom
                      ? "border-gold bg-gold/8"
                      : "border-sage/15 bg-white/5 focus:border-sage/40 focus:bg-white/8")} />

                {/* Payment methods */}
                <div className="grid grid-cols-2 gap-4 mb-7">
                  <div>
                    <p className={clsx(body, "text-mist/35 mb-2", isAm ? "text-[0.7rem]" : "text-[0.58rem] uppercase tracking-[0.14em]")}>{c.intlTitle}</p>
                    <div className="space-y-2">
                      {[
                        { label: "Stripe",  desc: c.stripeDesc,  Icon: CreditCard, color: "#00D084" },
                        { label: "PayPal",  desc: c.paypalDesc,  Icon: Wallet,     color: "#00D084" },
                      ].map(m => (
                        <button key={m.label} className="w-full flex items-center gap-3 p-3 rounded-xl border border-sage/10 hover:border-sage/30 transition-all group">
                          <m.Icon size={16} strokeWidth={1.6} style={{ color: m.color }} />
                          <div className="text-left">
                            <p className="font-sans text-mist/70 text-[0.72rem] font-semibold">{m.label}</p>
                            <p className={clsx(body, "text-mist/35", isAm ? "text-[0.62rem]" : "text-[0.58rem]")}>{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={clsx(body, "text-mist/35 mb-2", isAm ? "text-[0.7rem]" : "text-[0.58rem] uppercase tracking-[0.14em]")}>{c.localTitle}</p>
                    <div className="space-y-2">
                      {[
                        { label: "TeleBirr", desc: c.telebirrDesc, Icon: Smartphone, color: "#00D084" },
                        { label: "Chapa",    desc: c.chapaDesc,    Icon: Globe,      color: "#00D084" },
                      ].map(m => (
                        <button key={m.label} className="w-full flex items-center gap-3 p-3 rounded-xl border border-sage/10 hover:border-sage/30 transition-all group">
                          <m.Icon size={16} strokeWidth={1.6} style={{ color: m.color }} />
                          <div className="text-left">
                            <p className="font-sans text-mist/70 text-[0.72rem] font-semibold">{m.label}</p>
                            <p className={clsx(body, "text-mist/35", isAm ? "text-[0.62rem]" : "text-[0.58rem]")}>{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className={clsx("w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold",
                  "transition-all duration-200 hover:-translate-y-0.5",
                  isAm ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.82rem] uppercase tracking-[0.12em]")}
                  style={{ background: "linear-gradient(135deg,#D6FF00,#D6FF00)", color: "#1B1B1B",
                    boxShadow: "0 0 28px rgba(201,169,110,.5)" }}>
                  <Heart size={16} fill="currentColor" />{c.btnDonate}
                </button>
                <p className={clsx("text-center mt-3",
                  isAm ? "font-ethiopic text-[0.68rem]" : "font-sans text-[0.6rem]", "text-mist/25")}>
                  🔒 {c.secureNote}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
