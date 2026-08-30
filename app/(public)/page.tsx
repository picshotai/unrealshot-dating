import type { Metadata } from "next";
import { UnrealLandingPage } from "@/components/main-landing/UnrealLandingPage";
import { landingFaq } from "@/components/new-landing/data";
import { MultipleStructuredData } from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "AI Dating Photos for Men | Realistic Profile Pictures | UnrealShot",
  description:
    "Turn 4–6 selfies into 60 realistic dating photos across 15 coherent shoots. Built for Tinder, Hinge and Bumble. 15 free Photo Retakes included. $39 once.",
  canonical: "/",
  keywords: [
    "AI dating photos for men",
    "AI dating photoshoot generator for men",
    "dating profile pictures for men",
    "Tinder profile photos",
    "Hinge profile pictures",
    "realistic AI dating photos",
  ],
  ogType: "website",
});

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "UnrealShot Dating Profile",
  description:
    "60 AI dating photos delivered as 15 coherent shoots, with four frames per shoot and 15 included Photo Retakes.",
  brand: { "@type": "Brand", name: "UnrealShot" },
  image: "https://www.unrealshot.com/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg",
  offers: {
    "@type": "Offer",
    price: "39.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://www.unrealshot.com/login",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: landingFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <UnrealLandingPage />
      <MultipleStructuredData
        schemas={[
          { id: "dating-profile-product", data: productSchema },
          { id: "dating-profile-faq", data: faqSchema },
        ]}
      />
    </>
  );
}
