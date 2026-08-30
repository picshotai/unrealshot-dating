import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function CTASection() {
  const t = useTranslations("Home.cta")

  return (
    <section className="bg-[#111111] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* The Final Offer Card */}
          <div className="bg-[#161616] rounded-3xl border-2 border-dashed border-zinc-800 shadow-2xl p-8 sm:p-14 text-center">
            {/* The Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold leading-tight mb-4 font-[var(--font-inter-tight)] text-white">
              {t("title")} <span className="text-[#ff6f00]">{t("titleAccent")}</span>
            </h2>

            {/* The Sub-headline */}
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-2 leading-relaxed">
              {t("description")}
            </p>
            <p className="text-xl md:text-2xl font-bold text-white mb-8">
              {t("emphasis")}
            </p>

            {/* The Primary Call to Action Button */}
            <div className="inline-block relative">
              <Link href="/dashboard">
                <Button className="text-base sm:text-lg px-8 pr-16 py-6 group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer font-semibold shadow-[0_4px_25px_-5px_rgba(255,111,0,0.3)]">
                  {t("button")}
                  <div className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
                    <img
                      src="/arrow.svg"
                      alt="arrow-right"
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </Button>
              </Link>
            </div>

            {/* The Badges */}
            <div className="flex justify-center items-center gap-2 mt-8 text-sm">
              <p className="text-zinc-400 font-medium">
                {t("summary")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
