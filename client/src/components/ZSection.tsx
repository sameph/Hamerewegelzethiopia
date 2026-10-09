"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import clsx from "clsx";

// ── Animation variants ────────────────────────────────────────
export const slideFromLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideFromRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  },
});

export const zoomIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Image panel ───────────────────────────────────────────────
interface ImagePanelProps {
  icon: string;
  label: string;
  gradient: string;
  animationVariant: typeof slideFromLeft;
  inView: boolean;
  zoomEffect?: boolean;
}

export function ImagePanel({
  icon, label, gradient,
  animationVariant, inView, zoomEffect,
}: ImagePanelProps) {
  return (
    <motion.div
      variants={zoomEffect ? zoomIn : animationVariant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative"
    >
      {/* Shadow ring behind image */}
      <div
        className="absolute -inset-3 rounded-[28px] opacity-30 blur-xl"
        style={{ background: "radial-gradient(circle, #1B1B1B 0%, transparent 70%)" }}
      />
      {/* Image frame */}
      <div
        className="relative rounded-[22px] overflow-hidden aspect-[4/3] w-full"
        style={{
          boxShadow: "0 20px 60px rgba(27,27,27,.28), 0 4px 20px rgba(27,27,27,.15), 0 0 0 1.5px rgba(27,27,27,.12)",
        }}
      >
        {/* Placeholder — replace with <Image src="..." /> */}
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-4"
          style={{ background: gradient }}
        >
          <span style={{ fontSize: "4.5rem", opacity: 0.22 }}>{icon}</span>
          <span
            className="font-sans text-[0.62rem] uppercase tracking-[0.22em]"
            style={{ color: "rgba(0,208,132,0.4)" }}
          >
            {label}
          </span>
        </div>
        {/* Subtle overlay sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,245,233,0.06) 0%, transparent 50%, rgba(5,31,32,0.15) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Text panel ────────────────────────────────────────────────
interface TextPanelProps {
  tag: string;
  tagKey: string;
  title: string;
  titleKey: string;
  body: string;
  bodyKey: string;
  linkLabel: string;
  linkKey: string;
  linkHref: string;
  animationVariant: typeof slideFromLeft;
  inView: boolean;
  accentColor?: string;
  locale: string;
}

export function TextPanel({
  tag, title, body, linkLabel, linkHref,
  animationVariant, inView, accentColor = "#1B1B1B", locale,
}: TextPanelProps) {
  const isAmharic = locale === "am";

  return (
    <motion.div
      variants={animationVariant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col justify-center"
    >
      {/* Section tag */}
      <motion.p
        variants={fadeInUp(0.1)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={clsx(
          "flex items-center gap-3 font-medium mb-5",
          isAmharic ? "font-ethiopic text-[0.72rem] tracking-[0.06em]" : "font-sans text-[0.62rem] uppercase tracking-[0.28em]"
        )}
        style={{ color: accentColor }}
      >
        <span
          className="block w-8 h-0.5 flex-shrink-0 rounded-full"
          style={{ background: accentColor }}
        />
        {tag}
      </motion.p>

      {/* Title */}
      <motion.h2
        variants={fadeInUp(0.22)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={clsx(
          "font-serif font-semibold leading-[1.15] mb-6",
          "text-[clamp(1.85rem,3.2vw,2.7rem)]",
          isAmharic && "font-ethiopic !leading-[1.45]"
        )}
        style={{ color: "#1B1B1B" }}
      >
        {title}
      </motion.h2>

      {/* Decorative divider */}
      <motion.div
        variants={fadeInUp(0.32)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-14 h-0.5 rounded-full mb-6"
        style={{
          background: `linear-gradient(to right, ${accentColor}, transparent)`,
        }}
      />

      {/* Body text */}
      <motion.p
        variants={fadeInUp(0.42)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={clsx(
          "leading-[1.88] mb-8 max-w-[48ch]",
          isAmharic ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.97rem]"
        )}
        style={{ color: "rgba(5,31,32,0.72)" }}
      >
        {body}
      </motion.p>

      {/* Learn More link */}
      <motion.div
        variants={fadeInUp(0.56)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <a
          href={linkHref}
          className={clsx(
            "group inline-flex items-center gap-2.5 font-medium transition-all duration-300",
            isAmharic ? "font-ethiopic text-[0.88rem]" : "font-sans text-[0.82rem] uppercase tracking-[0.14em]"
          )}
          style={{ color: accentColor }}
        >
          <span
            className="relative"
            style={{
              paddingBottom: "2px",
              borderBottom: `1.5px solid transparent`,
            }}
          >
            {linkLabel}
            {/* Gold underline on hover via CSS sibling */}
            <span
              className="absolute bottom-0 left-0 w-0 group-hover:w-full transition-all duration-350"
              style={{ height: "1.5px", background: "#D6FF00", borderRadius: "1px" }}
            />
          </span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
}

// ── Main ZSection ─────────────────────────────────────────────
export interface ZSectionData {
  id: string;
  index: number;               // 0-based: even=img-left, odd=img-right
  bg: string;                  // CSS background value
  accentColor?: string;
  icon: string;
  imageLabel: string;
  imageGradient: string;
  zoomEffect?: boolean;

  // Translation keys
  tagKey: string;
  titleKey: string;
  bodyKey: string;
  linkKey: string;
  linkHref: string;

  // Resolved text (passed from server component)
  tag: string;
  title: string;
  body: string;
  linkLabel: string;
}

interface ZSectionProps {
  data: ZSectionData;
  locale: string;
}

export default function ZSection({ data, locale }: ZSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  const isImageLeft = data.index % 2 === 0;

  const imageAnim  = isImageLeft ? slideFromLeft : slideFromRight;
  const textAnim   = isImageLeft ? slideFromRight : slideFromLeft;

  const ImageEl = (
    <ImagePanel
      icon={data.icon}
      label={data.imageLabel}
      gradient={data.imageGradient}
      animationVariant={imageAnim}
      inView={inView}
      zoomEffect={data.zoomEffect}
    />
  );

  const TextEl = (
    <TextPanel
      tag={data.tag}
      tagKey={data.tagKey}
      title={data.title}
      titleKey={data.titleKey}
      body={data.body}
      bodyKey={data.bodyKey}
      linkLabel={data.linkLabel}
      linkKey={data.linkKey}
      linkHref={data.linkHref}
      animationVariant={textAnim}
      inView={inView}
      accentColor={data.accentColor}
      locale={locale}
    />
  );

  return (
    <section
      ref={ref}
      id={data.id}
      className="relative overflow-hidden"
      style={{ background: data.bg }}
    >
      {/* Subtle corner decorations */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(27,27,27,0.06) 0%, transparent 65%)",
          top: isImageLeft ? "-15%" : "auto",
          bottom: isImageLeft ? "auto" : "-15%",
          left: isImageLeft ? "-10%" : "auto",
          right: isImageLeft ? "auto" : "-10%",
        }}
      />

      <div className="max-w-[1360px] mx-auto px-8 sm:px-14 py-24 lg:py-32">
        {/* Desktop: Z-pattern grid */}
        <div className="hidden lg:grid grid-cols-2 gap-16 xl:gap-24 items-center">
          {isImageLeft ? (
            <>
              {ImageEl}
              {TextEl}
            </>
          ) : (
            <>
              {TextEl}
              {ImageEl}
            </>
          )}
        </div>

        {/* Mobile: always image on top */}
        <div className="flex flex-col gap-10 lg:hidden">
          {ImageEl}
          {TextEl}
        </div>
      </div>
    </section>
  );
}
