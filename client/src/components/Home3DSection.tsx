"use client";

import { motion } from "framer-motion";

export default function Home3DSection() {
  const blobs = [
    { size: 210, left: "8%", top: "12%", delay: 0, depth: 45 },
    { size: 140, left: "70%", top: "18%", delay: 0.4, depth: 30 },
    { size: 180, left: "58%", top: "60%", delay: 0.8, depth: 60 },
    { size: 110, left: "24%", top: "66%", delay: 1.2, depth: 28 },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-10" style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(12px)" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 208, 255, 0.25), transparent 60%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0" style={{ perspective: "1200px" }}>
        {blobs.map((blob, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.left,
              top: blob.top,
              background:
                "linear-gradient(145deg, rgba(122, 212, 232, 0.45), rgba(0, 208, 255, 0.12))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 16px 38px rgba(0, 208, 255, 0.2)",
            }}
            animate={{
              y: [-10, 12, -8],
              x: [-8, 10, -6],
              rotateY: [-10, 14, -10],
              rotateX: [8, -10, 8],
              z: [0, blob.depth, 0],
            }}
            transition={{
              duration: 8,
              delay: blob.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#7AD4E8]">Hamere Wengel</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-[#FFFDEE] md:text-6xl">
          Faith, Learning, and Mission in One Place
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#d9f1f7]/85">
          A modern spiritual platform connecting departments, education, and community outreach with clear structure and beautiful simplicity.
        </p>
      </div>
    </section>
  );
}
