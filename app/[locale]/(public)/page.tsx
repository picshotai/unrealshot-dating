import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UnrealLandingPage } from "@/components/main-landing/UnrealLandingPage";
import { MultipleStructuredData } from "@/components/seo/StructuredData";
import { getLocalizedMetadata, makeFaqJsonLd, makeProductJsonLd, makeWebApplicationJsonLd, publicUrl } from "@/lib/public-seo";
import type { PublishedPublicLocale } from "@/i18n/config";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await params).locale as PublishedPublicLocale;
  const t = await getTranslations({ locale, namespace: "Home" });
  return getLocalizedMetadata({
    locale,
    pathname: "/",
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t.raw("meta.keywords") as string[],
  });
}

export default async function Home({ params }: Params) {
  const locale = (await params).locale as PublishedPublicLocale;
  const t = await getTranslations({ locale, namespace: "Home" });
  const faqs = t.raw("faq.items") as Array<{ question: string; answer: string }>;
  const productFeatures = t.raw("pricing.features") as string[];

  return (
    <>
      <UnrealLandingPage />
      <MultipleStructuredData
        schemas={[
          {
            id: "dating-profile-product",
            data: makeProductJsonLd({
              name: t("pricing.heading"),
              description: t("pricing.packageDescription"),
              features: productFeatures,
              url: publicUrl("/", locale),
              locale,
            }),
          },
          { id: "dating-profile-faq", data: makeFaqJsonLd(faqs) },
          {
            id: "dating-profile-web-application",
            data: makeWebApplicationJsonLd({
              name: t("meta.title"),
              description: t("meta.description"),
              url: publicUrl("/", locale),
              locale,
              features: productFeatures,
            }),
          },
        ]}
      />
    </>
  );
}
