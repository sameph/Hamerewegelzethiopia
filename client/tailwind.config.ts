import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core design tokens
        primaryBg: "#D6FF00",
        limeCTA: "#A6FF4D",
        success: "#00D084",
        charcoal: "#1B1B1B",
        softWhite: "#F7F7F7",
        bodyText: "#333333",

        // Backward-compatible aliases used by existing components
        deep: "#1B1B1B",
        dark: "#1B1B1B",
        mid: "#00D084",
        forest: "#00D084",
        sage: "#D6FF00",
        mint: "#F7F7F7",
        mist: "#A6FF4D",
        gold: "#D6FF00",
        crimson: "#A6FF4D",
        "crimson-glow": "#D6FF00",
        limePrimary: "#A6FF4D",
        limeSecondary: "#D6FF00",
        yellowAccent: "#D6FF00",
        brightYellow: "#D6FF00",
        darkGreen: "#1B1B1B",
        lumme: {
          cream: "#F7F7F7",
          lime: "#A6FF4D",
          mint: "#D6FF00",
          forest: "#00D084",
          night: "#1B1B1B",
        },
      },
      fontFamily: {
        serif:    ["Cormorant Garamond", "Georgia", "serif"],
        sans:     ["DM Sans", "system-ui", "sans-serif"],
        ethiopic: [
          "Abyssinica SIL",
          "Noto Serif Ethiopic",
          "Nyala",
          "Ethiopia Jiret",
          "serif",
        ],
      },
      backdropBlur: {
        glass: "16px",
      },
      animation: {
        "pulse-gold":   "pulseGold 2.8s ease-in-out infinite",
        "pulse-red":    "pulseRed 2.8s ease-in-out infinite",
        "fade-in-up":   "fadeInUp 0.8s ease forwards",
        "scale-in":     "scaleIn 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        "scroll-down":  "scrollDown 2s ease-in-out infinite",
        "gradient-pan": "gradientPan 12s ease-in-out infinite alternate",
      },
      keyframes: {
        pulseGold: {
          "0%,100%": { boxShadow: "0 0 22px rgba(214,255,0,.35), 0 4px 20px rgba(27,27,27,.2)" },
          "50%":     { boxShadow: "0 0 45px rgba(214,255,0,.6), 0 8px 30px rgba(27,27,27,.25)" },
        },
        pulseRed: {
          "0%,100%": { boxShadow: "0 0 22px rgba(166,255,77,.35), 0 4px 20px rgba(27,27,27,.2)" },
          "50%":     { boxShadow: "0 0 48px rgba(214,255,0,.7), 0 8px 28px rgba(27,27,27,.28)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { transform: "scale(0.92)" },
          to:   { transform: "scale(1)" },
        },
        scrollDown: {
          "0%":   { transform: "scaleY(0)", transformOrigin: "top", opacity: "0" },
          "50%":  { transform: "scaleY(1)", transformOrigin: "top", opacity: "1" },
          "51%":  { transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom", opacity: "0" },
        },
        gradientPan: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
