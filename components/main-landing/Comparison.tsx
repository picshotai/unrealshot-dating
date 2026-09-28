"use client";

import Image from "next/image";
import {
  Camera,
  CircleCheck,
  CircleMinus,
  Heart,
  Images,
  Layers,
  MapPin,
  Smile,
  Sparkles,
  Tag,
  UserCheck,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LandingHeading, LandingSection, landingStyles } from "./LandingSection";

type Status = "yes" | "partial" | "no";

// Scores per row, in column order: UnrealShot, AI photo apps, photographer, camera roll.
// Row labels live in messages (Home.comparison.rows) in the same order.
const MATRIX: Status[][] = [
  ["yes", "partial", "yes", "yes"], //   looks like you in every photo
  ["yes", "no", "yes", "no"], //         photos that belong together
  ["yes", "partial", "no", "partial"], // variety of places and outfits
  ["yes", "no", "partial", "yes"], //    natural, not posed
  ["yes", "yes", "no", "partial"], //    no planning or awkward posing
  ["yes", "partial", "partial", "no"], // made for dating profiles
];
const ROW_ICONS: LucideIcon[] = [UserCheck, Layers, MapPin, Smile, Wand2, Heart];
const COLUMN_ICONS: LucideIcon[] = [Sparkles, Camera, Images];

// Column widths shared by the table and the raised UnrealShot card behind it.
// Phones show three columns (the camera-roll column is hidden), so each keeps room for its label.
const LABEL_COL = "w-[30%] sm:w-[40%]";
const FEATURED_POS = "left-[30%] w-[23.333%] sm:left-[40%] sm:w-[15%]";
const DESKTOP_ONLY = 3; // index of the column hidden on phones
const hideOnPhone = (c: number) => (c === DESKTOP_ONLY ? "hidden sm:table-cell" : "");

function StatusMark({ status, label }: { status: Status; label: string }) {
  const Icon = status === "yes" ? CircleCheck : status === "partial" ? CircleMinus : X;
  return (
    <>
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className={cn(
          "mx-auto size-[18px] sm:size-5",
          status === "yes" && "text-[#ff6f00]",
          status === "partial" && "text-zinc-400",
          status === "no" && "text-zinc-300",
        )}
      />
      <span className="sr-only">{label}</span>
    </>
  );
}

function RowLabel({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <th scope="row" className="py-3.5 pl-2.5 pr-1 text-left align-middle font-normal sm:py-4 sm:pl-5 sm:pr-2">
      <span className="flex items-center gap-3">
        <Icon aria-hidden="true" strokeWidth={1.5} className="hidden size-[18px] shrink-0 text-zinc-500 sm:block" />
        <span className="text-[12.5px] font-medium leading-snug text-[var(--landing-ink)] sm:text-[15px]">{children}</span>
      </span>
    </th>
  );
}

export default function PremiumComparison() {
  const t = useTranslations("Home.comparison");
  const columns = t.raw("columns") as string[];
  const rows = t.raw("rows") as string[];
  const prices = t.raw("prices") as string[];
  const status = t.raw("status") as Record<Status, string>;

  return (
    <LandingSection id="comparison">
      <LandingHeading eyebrow={t("eyebrow")} title={t("title")} accent={t("titleAccent")} description={t("description")} />

      <div className="mx-auto max-w-4xl rounded-3xl bg-[#eeebe6] p-2 max-sm:-mx-2 sm:p-4">
        <div className="relative">
          {/* The UnrealShot column: a raised white card behind its cells */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-12px_rgba(0,0,0,0.18)]",
              FEATURED_POS,
            )}
          />

          <table className="relative w-full table-fixed border-collapse">
            <colgroup>
              <col className={LABEL_COL} />
              {columns.map((column, c) => <col key={column} className={c === DESKTOP_ONLY ? "hidden sm:table-column" : ""} />)}
            </colgroup>

            <thead>
              <tr>
                <th scope="col"><span className="sr-only">{t("eyebrow")}</span></th>
                {columns.map((column, c) => {
                  const Icon = COLUMN_ICONS[c - 1];
                  return (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        "px-1 pb-4 pt-5 text-center align-bottom text-[clamp(10px,2.9vw,11px)] leading-tight sm:px-2 sm:pb-5 sm:pt-6 sm:text-sm",
                        c === 0 ? "font-semibold text-[var(--landing-ink)]" : "font-medium text-zinc-500",
                        hideOnPhone(c),
                      )}
                    >
                      {c === 0 ? (
                        <Image src="/site-logo.png" alt="" width={32} height={32} className="mx-auto mb-2.5 size-7 rounded-lg sm:size-8" />
                      ) : (
                        <Icon aria-hidden="true" strokeWidth={1.5} className="mx-auto mb-2.5 size-7 text-zinc-400 sm:size-8" />
                      )}
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, r) => (
                <tr key={row}>
                  <RowLabel icon={ROW_ICONS[r]}>{row}</RowLabel>
                  {MATRIX[r].map((s, c) => (
                    <td key={c} className={cn("px-1 py-3.5 text-center align-middle sm:py-4", hideOnPhone(c))}>
                      <StatusMark status={s} label={status[s]} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <RowLabel icon={Tag}>{t("priceLabel")}</RowLabel>
                {prices.map((price, c) => (
                  <td
                    key={price}
                    className={cn(
                      "px-1 pb-6 pt-3.5 text-center align-middle text-[11px] leading-tight sm:px-2 sm:pt-4 sm:text-[13px]",
                      c === 0 ? "font-semibold text-[var(--landing-ink)]" : "text-zinc-500",
                      hideOnPhone(c),
                    )}
                  >
                    {price}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className={`${landingStyles.note} mt-5 text-center`}>{t("note")}</p>
    </LandingSection>
  );
}
