import Link from "next/link";

export default function CTASection({ onContactHref, onFullStructureHref }: { onContactHref: string; onFullStructureHref: string }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="hero-neon rounded-2xl bg-charcoal p-8 text-center text-softWhite shadow-2xl">
        <div className="neon-glow-overlay" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">Questions about departments or programmes?</h3>
          <p className="mt-2 text-md text-softWhite/90">Contact the central team or browse our departments hub.</p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={onContactHref} className="w-full rounded-[10px] bg-limeCTA px-6 py-3 text-sm font-semibold text-charcoal transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(214,255,0,0.6)] sm:w-auto">
              Contact
            </Link>
            <Link href={onFullStructureHref} className="w-full rounded-[10px] bg-primaryBg px-6 py-3 text-sm font-semibold text-charcoal transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(214,255,0,0.6)] sm:w-auto">
              View departments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
