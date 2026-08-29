import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldCheck, Star } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-[#F7F5F3] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* The "Final Offer" Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xl shadow-gray-200/60 p-8 sm:p-12 text-center">

            {/* The Headline */}
            <h2 className="text-4xl sm:text-5xl max-w-4xl mx-auto font-bold leading-tight mb-4 font-[var(--font-inter-tight)] text-gray-900">
              Stop letting bad photos <span className="text-[#ff6f00]">make the decision for you.</span>
            </h2>
            
            {/* The Sub-headline */}
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-2">
              You already know what it&apos;s like to scroll through your camera roll and realize none of it really works for your dating profile.
            </p>
            <p className="text-xl font-bold text-gray-900 mb-8">
              Fix the camera roll.
            </p>

            {/* The Primary Call to Action Button */}
        <Link href="/dashboard">
              <Button
                className="text-md py-6 group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer pr-12"
              >
                Build My Profile — $39
                <div className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
                  <img
                    src="/arrow.svg"
                    alt="arrow-right"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Button>
            </Link>

            {/* The Badges */}
            <div className="flex justify-center items-center gap-2 mt-8 text-sm text-gray-500">
               <p className="text-gray-600 font-medium">
                 60 photos · 15 shoots · 30 re-shoots · One-time purchase
               </p>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  )
}
