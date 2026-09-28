"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { LandingHeading, LandingSection, landingStyles } from "./LandingSection";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const id = useId();
  const t = useTranslations("Home.faq");
  const faqs = t.raw("items") as Array<{ question: string; answer: string }>;

  return (
    <LandingSection id="faq">
      <LandingHeading eyebrow={t("eyebrow")} title={t("title")} accent={t("titleAccent")} description={t("description")} />
      <div className="mx-auto max-w-3xl divide-y divide-zinc-200 border-y border-zinc-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = isOpen ? Minus : Plus;
          return (
            <div key={faq.question}>
              <h3>
                <button
                  id={`${id}-question-${index}`}
                  type="button"
                  className={`${landingStyles.h3} flex w-full items-center justify-between gap-5 py-5 text-left text-zinc-900 transition-colors hover:text-[#c95200] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 sm:py-6`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-answer-${index}`}
                >
                  <span className="min-w-0">{faq.question}</span>
                  <Icon className="size-5 shrink-0 text-[#c95200]" aria-hidden="true" />
                </button>
              </h3>
              <div id={`${id}-answer-${index}`} role="region" aria-labelledby={`${id}-question-${index}`} hidden={!isOpen} className="pb-6 pr-6 sm:pr-12">
                <p className={landingStyles.body}>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
