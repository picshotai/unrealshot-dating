import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StylePacks() {
  const cardData = [
    {
      title: "The Opener",
      description:
        "The photo that makes someone stop long enough to look at the rest.",
      image: "/images/aimodel5.jpg",
      url: "/dashboard",
    },
    {
      title: "The Full-Body",
      description:
        "No hiding. No bathroom mirror. Just a natural photo that builds trust.",
      image: "/images/full-body-photo.webp",
      url: "/dashboard",
    },
    {
      title: "The Candid",
      description:
        "You doing something instead of obviously posing for a dating app.",
      image: "/images/candid-solo.webp",
      url: "/dashboard",
    },
    {
      title: "The Well-Dressed One",
      description:
        "Proof you clean up well without looking like you're applying for a job.",
      image: "/images/aimodel8.jpg",
      url: "/dashboard",
    },
    {
      title: "The Outdoors One",
      description:
        "Your profile suddenly feels like a life, not six photos inside the same room.",
      image: "/new-landing/mountain-layby-motorcycle_2.png",
      url: "/dashboard",
    },
    {
      title: "The “I Actually Do Things” One",
      description:
        "Something real about you that gives her an easy reason to message.",
      image: "/new-landing/training-floor-morning-2.png",
      url: "/dashboard",
    },
  ];

  return (
    <section id="style-packs" className="py-16 md:py-20 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="mb-10 sm:mb-12 max-w-5xl">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 block">
            WHAT A DATING PROFILE NEEDS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 tracking-tight leading-[1.08]">
            A good dating profile doesn&apos;t need more photos.{" "}
            <br className="hidden sm:inline" />
            <span className="text-[#ff6f00]">It needs the right photos.</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
            Every picture has a job: get attention, build trust, show your life or give someone something to ask you about.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {cardData.map((card, index) => (
              <Card
                key={index}
                className="bg-black p-0 rounded-[15px] overflow-hidden border border-gray-700 shadow-md transition-all duration-300 hover:border-[#ff6f00] hover:border-2"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-black rounded-bl-[32px] z-10" />
                    <Link href={card.url}>
                      <Image
                        src={card.image}
                        alt={`${card.title} example`}
                        fill
                        className="w-full h-full object-cover rounded-t-[18px]"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </Link>
                    <Link href={card.url}>
                      <Button
                        size="icon"
                        className="absolute top-3 right-3 rounded-full bg-[#ff6f00]/80 hover:bg-[#ff6f00] transition-colors duration-300 z-20"
                      >
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      </Button>
                    </Link>
                  </div>
                  <div className="p-3 sm:p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-tight">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="max-w-2xl mb-4 md:mb-0">
            <p className="text-base sm:text-lg text-gray-300">
              <span className="text-white font-semibold">15 shoots. 60 photos.</span>{" "}
              Enough range to build one complete profile.
            </p>
          </div>
          <p className="text-gray-300 italic text-sm md:transform md:rotate-6 md:w-48 sm:text-center sm:w-auto">
            15 individual Photo Retakes included with every order
          </p>
        </div>
      </div>
    </section>
  );
}