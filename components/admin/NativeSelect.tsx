import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Native <select> (works with plain FormData) styled for the dark admin theme.
 * Without an explicit color-scheme and option colors, browsers draw the popup
 * white while the options inherit the page's light text, so they vanish.
 */
export function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs [color-scheme:dark]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50",
        "[&>option]:bg-background [&>option]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
