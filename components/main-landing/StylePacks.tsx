import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StylePacks() {
  const cardData = [
    {
      title: "The Opener",
      description:
        "Clear face. Good light. Relaxed confidence. The photo that earns the second swipe.",
      image: "/content/doctor1.webp",
      url: "/ai-doctor-headshots",
    },
    {
      title: "The Full-Body",
      description:
        "Natural, flattering and believable — without looking like you hired someone to photograph you.",
      image: "/content/socialimage.jpg",
      url: "/ai-instagram-photoshoot",
    },
    {
      title: "The Candid",
      description:
        "Looking away, laughing, walking, doing something. Less “AI portrait.” More actual camera roll.",
      image: "/content/glamour3.webp",
      url: "/ai-glamour-photoshoot",
    },
    {
      title: "The Well-Dressed One",
      description:
        "Dinner, drinks, weddings, evenings out — when looking sharp actually makes sense.",
      image: "/content/corporate1.jpg",
      url: "/corporate-headshots",
    },
    {
      title: "The Outdoors One",
      description:
        "Trips, walks, beaches, mountains and weekends that make your profile feel alive.",
      image: "/content/professional1.jpg",
      url: "/professional-headshots",
    },
    {
      title: "The “I Actually Do Things” One",
      description:
        "Choose from real interests so your profile gives someone something to ask you about.",
      image: "/content/christmas1.jpg",
      url: "/ai-christmas-photoshoot",
    },
    {
      title: "The Golden Hour One",
      description:
        "Warm sunset light, relaxed vibe, natural aesthetic that catches the eye instantly.",
      image: "/content/founder1.jpg",
      url: "/founder-headshots",
    },
    {
      title: "The Weekend Casual",
      description:
        "Coffee runs, bookshops, Sunday walks — effortless lifestyle photos that feel genuine.",
      image: "/content/lawyer5.webp",
      url: "/ai-lawyer-headshots",
    },
  ];

  return (
    <section id="style-packs" className="min-h-screen bg-[#111111]">
        <div className="py-20 min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
            {/* Title Section */}
            <div className="mb-16 max-w-4xl">
                <p className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-4 block">
                  NOT RANDOM AI PHOTOS
                </p>
              <h2 className="text-4xl md:text-6xl text-white font-bold mb-6 leading-tight">
                A dating profile needs <span className="text-[#ff6f00]">more than one good picture.</span>
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                A great profile should show what you look like and what being around you might feel like.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {cardData.map((card, index) => (
                <Card
                  key={index}
                  className="bg-black p-0 rounded-[15px] overflow-hidden border border-gray-700 shadow-md transition-all duration-300 hover:border-[#ff6f00] hover:border-2"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-black rounded-bl-[32px] z-10" />
                      <Link href={card.url}>
                        <Image
                          src={card.image}
                          alt={`${card.title} example`}
                          width={400}
                          height={300}
                          className="w-full object-cover rounded-t-[18px]"
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
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  <span className="text-white font-semibold">15 shoots. 60 photos.</span>{" "}
                  Enough range to build one complete profile.
                </p>
              </div>
              <p className="text-gray-300 italic text-sm md:transform md:rotate-6 md:w-48 sm:text-center sm:w-auto">
                15 individual Photo Retakes included with every order
              </p>
            </div>
          </div>
        </div>
      </section>
  );
}