import type { Formats } from "next-intl"

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  number: {
    compact: {
      maximumFractionDigits: 1,
      notation: "compact",
    },
    integer: {
      maximumFractionDigits: 0,
    },
  },
} satisfies Formats
