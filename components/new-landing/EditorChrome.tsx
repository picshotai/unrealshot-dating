"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "WHY IT WORKS", href: "#why" },
  { label: "THE SHOOTS", href: "#shoots" },
  { label: "HOW IT WORKS", href: "#how" },
  { label: "FAQ", href: "#faq" },
];

function Mark() {
  return (
    <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M4 20a8 8 0 0 1 16 0" />
      <path d="M7 20a5 5 0 0 1 10 0" />
      <path d="M10 20a2 2 0 0 1 4 0" />
    </svg>
  );
}

export function EditorChrome() {
  const [time, setTime] = useState("--:--:--");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date()
          .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .toUpperCase(),
      );

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <header className="relative z-50 flex h-[62px] items-center justify-between border-b border-black/10 bg-white px-4 sm:px-6">
        <Link href="/" aria-label="UnrealShot home" className="flex h-full items-center gap-3 text-black">
          <Mark />
          <span className="hidden text-[13px] font-extrabold tracking-[-0.04em] sm:block">UNREALSHOT</span>
          <span className="h-9 w-px bg-black/10" />
          <span className="hidden font-mono text-[9px] font-bold tracking-[0.18em] text-black/45 md:block">
            DATING PROFILE STUDIO
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[10px] font-semibold tracking-[0.14em] text-black/45 sm:block">
            {time}
          </span>
          <Link
            href="/login"
            className="hidden border border-black bg-black px-4 py-2 font-mono text-[10px] font-bold tracking-[0.13em] text-white transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            BUILD MY PROFILE ↗
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="landing-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 border border-black px-3 py-2 text-black transition-colors hover:bg-[#f7b733]"
          >
            <span className="font-mono text-[10px] font-bold tracking-[0.12em]">MENU</span>
            <span aria-hidden="true" className="text-base leading-none">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </header>

      <div className="relative z-40 flex h-6 w-full items-end overflow-hidden border-b border-black/10 bg-white">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="relative h-full w-[100px] shrink-0 border-l border-black/10 first:border-l-0">
            {index > 0 && (
              <span className="absolute left-1 top-0.5 font-mono text-[8px] text-black/35">{index * 100}</span>
            )}
            <span className="absolute bottom-0 left-1/4 h-1 w-px bg-black/15" />
            <span className="absolute bottom-0 left-1/2 h-1.5 w-px bg-black/15" />
            <span className="absolute bottom-0 left-3/4 h-1 w-px bg-black/15" />
          </div>
        ))}
      </div>

      {menuOpen && (
        <div id="landing-menu" className="absolute right-4 top-[62px] z-[60] w-[min(340px,calc(100vw-2rem))] border border-black bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] sm:right-6">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-black/10 px-4 py-4 font-mono text-[11px] font-bold tracking-[0.12em] text-black transition-colors last:border-b-0 hover:bg-[#f7b733]"
            >
              <span>0{index + 1} / {item.label}</span>
              <span>↘</span>
            </a>
          ))}
          <Link
            href="/login"
            className="mt-2 flex items-center justify-between bg-black px-4 py-4 font-mono text-[11px] font-bold tracking-[0.12em] text-white"
          >
            START FOR $39 <span>↗</span>
          </Link>
        </div>
      )}
    </>
  );
}

