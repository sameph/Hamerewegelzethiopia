"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";

export default function LocaleFadeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, isSwitching } = useLang();

  return (
    <motion.div
      key={locale}
      animate={{ opacity: isSwitching ? 0 : 1 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      style={{ willChange: "opacity" }}
    >
      {children}
    </motion.div>
  );
}
