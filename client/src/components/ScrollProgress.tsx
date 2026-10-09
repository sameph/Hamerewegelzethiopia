"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import clsx from "clsx";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setShowTop(v > 0.15));
  }, [scrollYProgress]);

  return (
    <>
      {/* ── Vertical scroll progress bar — bottom-right ── */}
      <div
        className="fixed bottom-0 right-3 w-[3px] h-[40vh] z-50 pointer-events-none"
        aria-hidden="true"
      >
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-sage/10" />
        {/* Fill — grows from bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full origin-bottom"
          style={{
            scaleY,
            background: "linear-gradient(to top, #00D084, #1B1B1B)",
          }}
        />
      </div>

      {/* ── Scroll-to-top button — bottom-right ── */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={showTop ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        aria-label="Scroll to top"
        className={clsx(
          "fixed bottom-12 right-4 z-50",
          "w-9 h-9 rounded-full",
          "glass flex items-center justify-center",
          "text-sage hover:text-mint hover:bg-sage/80",
          "transition-colors duration-200 cursor-pointer",
          "shadow-lg shadow-charcoal/30"
        )}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M8 12V4M4 8l4-4 4 4" />
        </svg>
      </motion.button>
    </>
  );
}
