import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-black px-4 pb-24 pt-20 text-white sm:px-6 lg:pb-10 lg:pt-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col items-center text-center">
          <span className="font-serif text-2xl italic text-[#45c4f9]">the profile can be done now</span>
          <h2 className="mt-4 max-w-5xl font-oxanium text-[clamp(3.4rem,9vw,9rem)] font-medium leading-[0.82] tracking-[-0.085em]">
            Stop putting off your photos.
          </h2>
          <Link
            href="/login"
            className="group mt-10 flex h-14 items-center shadow-sm transition-transform hover:-translate-y-1 sm:h-16"
          >
            <span className="flex h-full items-center bg-white px-6 font-mono text-[11px] font-bold tracking-[0.13em] text-black sm:px-8 sm:text-[12px]">
              START FOR $39
            </span>
            <span className="grid h-full w-14 place-items-center border-l-2 border-dashed border-black bg-[#f7b733] text-2xl text-black transition-colors group-hover:bg-[#ec2578] group-hover:text-white sm:w-16">
              ↗
            </span>
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
    <Link
      href="/login"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 border border-black bg-white px-4 py-3 font-mono text-[9px] font-bold tracking-[0.12em] text-black shadow-[0_5px_24px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-1"
    >
      <span className="h-2 w-2 bg-[#ec2578]" />
      BUILD MY PROFILE
      <span>↗</span>
    </Link>
  );
}

