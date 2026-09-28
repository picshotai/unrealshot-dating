"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Link as PublicLink } from "@/i18n/navigation";
import { authorityLinksCopy } from "@/lib/authority-links-copy";
import { LandingHeading, LandingSection, landingStyles } from "./LandingSection";

export default function AuthorityLinks() {
  const copy = authorityLinksCopy[useLocale() as keyof typeof authorityLinksCopy];
  return (
    <LandingSection aria-labelledby="landing-guides">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <div id="landing-guides">
          <LandingHeading align="left" eyebrow={copy.eyebrow} title={copy.heading} />
        </div>
        <ul className="border-t border-[var(--landing-line)]">
          {copy.pages.map((page) => (
            <li key={page.href} className="border-b border-[var(--landing-line)]">
              <PublicLink
                href={page.href}
                className="group flex items-start justify-between gap-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 sm:py-6"
              >
                <span className="min-w-0">
                  <span className={`${landingStyles.itemTitle} block transition-colors group-hover:text-[#c95200]`}>{page.title}</span>
                  <span className={`${landingStyles.body} mt-1.5 block`}>{page.text}</span>
                </span>
                <ArrowUpRight
                  className="mt-1 size-5 shrink-0 text-[var(--landing-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#c95200]"
                  aria-hidden="true"
                />
              </PublicLink>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
