import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-black px-4 pb-24 pt-20 text-white sm:px-6 lg:pb-10 lg:pt-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col items-center text-center">
          <span className="font-serif text-2xl italic text-[#45c4f9]">the profile can be done now</span>
          <h2 className="mt-4 max-w-5xl font-[family-name:var(--font-space-grotesk)] text-[clamp(3.4rem,9vw,9rem)] font-medium leading-[0.82] tracking-[-0.085em]">
            Stop putting off your photos.
          </h2>
          <Link href="/login" className="mt-10 flex h-16 items-center bg-white pr-6 font-mono text-[11px] font-bold tracking-[0.13em] text-black shadow-[7px_7px_0_#ec2578] transition-transform hover:-translate-y-1">
            <span className="mr-6 grid h-16 w-16 place-items-center bg-[#f7b733] text-2xl">↗</span>
            START FOR $39
          </Link>
        </div>

        <div className="mt-24 flex flex-col gap-8 border-t border-white/20 pt-8 font-mono text-[9px] font-bold tracking-[0.12em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">UNREALSHOT</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/pricing" className="hover:text-white">PRICING</Link>
            <Link href="/privacy-policy" className="hover:text-white">PRIVACY</Link>
            <Link href="/terms" className="hover:text-white">TERMS</Link>
            <Link href="/refund-policy" className="hover:text-white">REFUNDS</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function FloatingCta() {
  return (
    <Link href="/login" className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 font-mono text-[9px] font-bold tracking-[0.12em] text-black shadow-[0_5px_24px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-1">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ec2578]" />
      BUILD MY PROFILE
      <span>↗</span>
    </Link>
  );
}

