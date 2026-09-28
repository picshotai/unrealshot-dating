import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./landing-system.module.css";

export { styles as landingStyles };

export function LandingSection({ dark, children, className, ...props }: ComponentProps<"section"> & { dark?: boolean }) {
  return (
    <section className={cn(styles.section, dark && styles.dark, className)} {...props}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}

export function LandingHeading({ title, accent, eyebrow, description, align = "center" }: {
  title: string;
  accent?: string;
  eyebrow?: string;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <header className={cn(styles.heading, align === "left" && styles.headingLeft)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={styles.title}>{title}{accent && <> <span className={styles.accent}>{accent}</span></>}</h2>
      {description && <p className={styles.lead}>{description}</p>}
    </header>
  );
}

export function LandingCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className={styles.card}>
      <Icon className={styles.icon} aria-hidden="true" />
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={cn(styles.body, "mt-3")}>{description}</p>
    </div>
  );
}

export function LandingCta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Link href="/login" className={cn(styles.cta, className)}>
      <span>{children}</span>
      <span className={styles.ctaIcon}><ArrowRight className="size-4" aria-hidden="true" /></span>
    </Link>
  );
}
