import Link from "next/link";
import { Button } from "@/components/ui/button";

export const DEFAULT_PAGE_SIZE = 25;

export function parsePage(value: string | undefined) {
  return Math.max(1, Number.parseInt(value ?? "1", 10) || 1);
}

/** Slices an in-memory list; clamps the page so a stale ?page= never shows an empty list. */
export function paginate<T>(rows: T[], requestedPage: number, pageSize = DEFAULT_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  return { page, totalPages, total: rows.length, items: rows.slice((page - 1) * pageSize, page * pageSize) };
}

/**
 * Prev / next links that keep the page's other query params (filters, search).
 * `param` lets one page hold more than one paginated list.
 */
export function Pager({
  basePath,
  params,
  page,
  totalPages,
  total,
  noun = "items",
  param = "page",
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
  total: number;
  noun?: string;
  param?: string;
}) {
  if (total === 0) return null;
  const href = (target: number) => {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value && key !== param) sp.set(key, value);
    if (target > 1) sp.set(param, String(target));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Button asChild variant="outline" size="sm" className={page <= 1 ? "pointer-events-none opacity-50" : ""}>
        <Link href={href(page - 1)} aria-disabled={page <= 1} scroll={false}>Prev</Link>
      </Button>
      <span className="text-muted-foreground">
        Page {page} of {totalPages} · {total} {noun}
      </span>
      <Button asChild variant="outline" size="sm" className={page >= totalPages ? "pointer-events-none opacity-50" : ""}>
        <Link href={href(page + 1)} aria-disabled={page >= totalPages} scroll={false}>Next</Link>
      </Button>
    </div>
  );
}
