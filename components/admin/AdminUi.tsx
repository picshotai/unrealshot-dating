import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function StatCard({ label, value, hint, href }: { label: string; value: string | number; hint?: string; href?: string }) {
  const body = (
    <div className={cn("rounded-lg border bg-card p-4", href && "transition-colors hover:bg-muted/40")}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function Section({ title, description, actions, children }: { title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function MigrationNotice() {
  return (
    <Alert>
      <AlertTitle>Email log and audit log need a migration</AlertTitle>
      <AlertDescription>
        Run <code>supabase/migrations/043_admin_panel.sql</code> in the Supabase SQL editor. Emails still send without it, but they won&apos;t be recorded.
      </AlertDescription>
    </Alert>
  );
}

export function FilterTabs({ base, current, options }: { base: string; current: string; options: { value: string; label: string; count?: number }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <Link
          key={o.value}
          href={o.value ? `${base}?status=${o.value}` : base}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            current === o.value ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="ml-1 tabular-nums opacity-70">{o.count}</span>}
        </Link>
      ))}
    </div>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-6 text-center text-sm text-muted-foreground">{children}</td>
    </tr>
  );
}
