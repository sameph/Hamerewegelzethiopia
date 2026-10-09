"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

interface Content {
  heroTag: string; heroTitle: string; heroSub: string;
  studentLabel: string; teacherLabel: string; adminLabel: string;
  emailLabel: string; passwordLabel: string;
  loginBtn: string; forgot: string;
  registerPrompt: string; registerLink: string;
  featuresTitle: string;
  features: string[];
}

const ROLE_ICONS = ["👨‍🎓", "👩‍🏫", "⚙️"];
const ROLE_KEYS = ["student", "teacher", "admin"] as const;
const MOCK_USERS = {
  student: { email: "student@hamerewongel.org", password: "password123" },
  teacher: { email: "teacher@hamerewongel.org", password: "password123" },
  admin: { email: "admin@hamerewongel.org", password: "password123" },
} as const;

const LMSClient = memo(function LMSClient({ locale, c }: { locale: string; c: Content }) {
  const router = useRouter();
  const { login } = useAuth();
  const isAm = locale === "am";
  const [role, setRole] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const roles = [c.studentLabel, c.teacherLabel, c.adminLabel];

  const handleLogin = useCallback(() => {
    const roleKey = ROLE_KEYS[role];
    const user = MOCK_USERS[roleKey];
    if (email === user.email && password === user.password) {
      login({ role: roleKey, email });
      router.push(`/${locale}/lms/dashboard`);
    } else {
      setError(isAm ? "ትክክለኛ ኢሜል ወይም የይለፍ ቃል አልሆነም" : "Invalid email or password");
    }
  }, [role, email, password, login, router, locale, isAm]);

  const inputSt = {
    width: "100%", padding: ".8rem 1rem",
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(0,208,132,.2)",
    borderRadius: 9, color: "#F7F7F7", outline: "none",
    fontSize: ".9rem", transition: "border-color .2s, box-shadow .2s",
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #1B1B1B 0%, #00D084 40%, #1B1B1B 100%)", minHeight: "100vh" }}>

      {/* Hero band */}
      <div style={{ padding: "7rem 2.5rem 4rem", borderBottom: "1px solid rgba(0,208,132,.07)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p className={clsx(isAm ? "font-ethiopic text-[.78rem]" : "font-sans text-[.62rem] uppercase tracking-[.28em]")}
            style={{ color: "#D6FF00", display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem", marginBottom: "1rem" }}>
            <span style={{ display: "block", width: "2rem", height: 1, background: "#D6FF00" }} />
            {c.heroTag}
            <span style={{ display: "block", width: "2rem", height: 1, background: "#D6FF00" }} />
          </p>
          <h1 className={clsx("font-serif font-semibold text-white", isAm && "font-ethiopic leading-[1.4]")}
            style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", marginBottom: "1.2rem", lineHeight: 1.08 }}>
            {c.heroTitle}
          </h1>
          <p className={clsx("max-w-[46ch] mx-auto", isAm ? "font-ethiopic text-[.88rem]" : "font-sans text-[.96rem]")}
            style={{ color: "rgba(247,247,247,.6)", lineHeight: 1.85 }}>
            {c.heroSub}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "5rem 2.5rem", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

        {/* Login card */}
        <div style={{ background: "rgba(11,43,38,.5)", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(0,208,132,.12)" }}>

            {/* Role tabs */}
            <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,208,132,.18)", marginBottom: "1.8rem" }}>
              {roles.map((r, i) => (
                <button key={i} onClick={() => setRole(i)}
                  className={clsx(isAm ? "font-ethiopic text-[.78rem]" : "font-sans text-[.68rem] uppercase tracking-[.08em]")}
                  style={{ flex: 1, padding: ".6rem", border: "none", cursor: "pointer", transition: "all .2s", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                    background: role === i ? "#1B1B1B" : "transparent",
                    color: role === i ? "#F7F7F7" : "rgba(247,247,247,.45)" }}>
                  <span>{ROLE_ICONS[i]}</span> {r}
                </button>
              ))}
            </div>

            {/* Role indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1.5rem", padding: ".7rem 1rem", background: "rgba(27,27,27,.15)", borderRadius: 8, border: "1px solid rgba(0,208,132,.1)" }}>
              <span style={{ fontSize: "1.2rem" }}>{ROLE_ICONS[role]}</span>
              <p className={clsx(isAm ? "font-ethiopic text-[.78rem]" : "font-sans text-[.72rem]")}
                style={{ color: "#00D084" }}>
                {isAm ? `${roles[role]} ሆነው እየገቡ ነው` : `Signing in as ${roles[role]}`}
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: "1.2rem", padding: ".7rem", background: "rgba(214,255,0,.12)", border: "1px solid rgba(214,255,0,.28)", borderRadius: 8, color: "#1B1B1B" }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label className={clsx("block mb-1.5", isAm ? "font-ethiopic text-[.76rem]" : "font-sans text-[.62rem] uppercase tracking-[.14em]")}
                style={{ color: "rgba(247,247,247,.5)" }}>{c.emailLabel}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={inputSt}
                onFocus={e => { e.target.style.borderColor = "#00D084"; e.target.style.boxShadow = "0 0 0 3px rgba(0,208,132,.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(0,208,132,.2)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.6rem" }}>
              <label className={clsx("block mb-1.5", isAm ? "font-ethiopic text-[.76rem]" : "font-sans text-[.62rem] uppercase tracking-[.14em]")}
                style={{ color: "rgba(247,247,247,.5)" }}>{c.passwordLabel}</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputSt, paddingRight: "3rem" }}
                  onFocus={e => { e.target.style.borderColor = "#00D084"; e.target.style.boxShadow = "0 0 0 3px rgba(0,208,132,.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,208,132,.2)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: "absolute", right: ".9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(247,247,247,.4)", fontSize: ".9rem" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button className={clsx(isAm ? "font-ethiopic text-[.9rem]" : "font-sans text-[.8rem] uppercase tracking-[.12em]")}
              style={{ width: "100%", padding: "1rem", borderRadius: 10, background: "linear-gradient(180deg,#D6FF00 0%,#00D084 55%,#1B1B1B 100%)", color: "#F7F7F7", border: "none", cursor: "pointer", fontWeight: 700, boxShadow: "0 0 24px rgba(7,102,83,.45)", transition: "all .25s", marginBottom: "1rem" }}
              onClick={handleLogin}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 44px rgba(227,239,38,.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 24px rgba(7,102,83,.45)"; e.currentTarget.style.transform = "none"; }}>
              {c.loginBtn}
            </button>

            {/* Forgot + register */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className={clsx(isAm ? "font-ethiopic text-[.74rem]" : "font-sans text-[.68rem]")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(247,247,247,.38)", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#00D084")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(247,247,247,.38)")}>
                {c.forgot}
              </button>
              <p className={clsx(isAm ? "font-ethiopic text-[.74rem]" : "font-sans text-[.68rem]")}
                style={{ color: "rgba(247,247,247,.38)" }}>
                {c.registerPrompt}{" "}
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#00D084", textDecoration: "underline" }}>{c.registerLink}</button>
              </p>
            </div>
          </div>

        {/* Features */}
        <div>
            <h2 className={clsx("font-serif font-semibold mb-8", isAm && "font-ethiopic")}
              style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "#F7F7F7" }}>
              {c.featuresTitle}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {c.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".9rem", padding: "1rem 1.2rem", background: "rgba(11,43,38,.4)", borderRadius: 10, border: "1px solid rgba(0,208,132,.08)", transition: "all .25s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,208,132,.22)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(27,27,27,.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,208,132,.08)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(11,43,38,.4)"; }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#1B1B1B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".55rem", color: "#00D084" }}>✓</span>
                  <span className={clsx(isAm ? "font-ethiopic text-[.84rem]" : "font-sans text-[.88rem]")}
                    style={{ color: "rgba(247,247,247,.75)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Mobile responsive */}
      <style>{`@media(max-width:768px){ .lms-grid{grid-template-columns:1fr !important} }`}</style>
    </div>
  );
});

export default LMSClient;
