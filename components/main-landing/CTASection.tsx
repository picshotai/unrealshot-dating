import { useTranslations } from "next-intl";
import { LandingCta, LandingHeading, LandingSection, landingStyles } from "./LandingSection";

export function CTASection() {
  const t = useTranslations("Home.cta");
  return (
    <LandingSection dark>
      <LandingHeading eyebrow={t("eyebrow")} title={t("title")} accent={t("titleAccent")} description={t("description")} />
      <div className="flex flex-col items-center gap-5 text-center">
        <p className={landingStyles.statement}>{t("emphasis")}</p>
        <LandingCta>{t("button")}</LandingCta>
        <p className={landingStyles.note}>{t("summary")}</p>
      </div>
    </LandingSection>
  );
}
