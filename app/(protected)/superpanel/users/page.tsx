import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyRow } from "@/components/admin/AdminUi";
import EmailDialogButton from "@/components/admin/EmailDialogButton";
import { Pager, paginate, parsePage } from "@/components/admin/Pager";
import { StageBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/admin/guard";
import { getUserSummaries, getRequestNow } from "@/lib/admin/data";
import { adminEmailContext } from "@/lib/admin/email/send";
import { formatMoney, timeAgo } from "@/lib/admin/format";
import { STAGE_TEMPLATE } from "@/lib/admin/segments";
import { LIFECYCLE_LABELS, type LifecycleStage } from "@/lib/admin/types";

const PAGE_SIZE = 50;

function isStage(value: string | undefined): value is LifecycleStage {
  return !!value && value in LIFECYCLE_LABELS;
}

export default async function SuperPanelUsers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stage?: string; page?: string }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const stage = isStage(params.stage) ? params.stage : undefined;

  const all = await getUserSummaries();
  const filtered = all.filter(
    (u) =>
      (!stage || u.stage === stage) &&
      (!q || u.email.toLowerCase().includes(q) || u.id.includes(q) || u.name.toLowerCase().includes(q))
  );
  const { items: rows, page, totalPages, total } = paginate(filtered, parsePage(params.page), PAGE_SIZE);
  const emailContext = adminEmailContext();
  const now = getRequestNow();

  const stageCounts = new Map<string, number>();
  for (const u of all) stageCounts.set(u.stage, (stageCounts.get(u.stage) ?? 0) + 1);

  const href = (next: { stage?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    const s = "stage" in next ? next.stage : stage;
    if (s) sp.set("stage", s);
    if (next.page && next.page > 1) sp.set("page", String(next.page));
    const qs = sp.toString();
    return qs ? `/superpanel/users?${qs}` : "/superpanel/users";
  };

  return (
    <div className="space-y-4">
      <form className="flex flex-wrap gap-2" action="/superpanel/users">
        <Input name="q" defaultValue={params.q ?? ""} placeholder="Search email, name or user ID" className="max-w-sm" />
        {stage && <input type="hidden" name="stage" value={stage} />}
        <Button type="submit" variant="secondary">Search</Button>
        {(q || stage) && (
          <Button asChild variant="ghost">
            <Link href="/superpanel/users">Clear</Link>
          </Button>
        )}
      </form>

      <div className="flex flex-wrap gap-1.5">
        <Link href={href({ stage: undefined })} className={`rounded-full border px-3 py-1 text-xs ${!stage ? "border-foreground bg-foreground text-background" : "text-muted-foreground"}`}>
          All <span className="opacity-70">{all.length}</span>
        </Link>
        {(Object.keys(LIFECYCLE_LABELS) as LifecycleStage[]).map((s) => (
          <Link
            key={s}
            href={href({ stage: s })}
            className={`rounded-full border px-3 py-1 text-xs ${stage === s ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
          >
            {LIFECYCLE_LABELS[s]} <span className="opacity-70">{stageCounts.get(s) ?? 0}</span>
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Signed up</TableHead>
              <TableHead>Last seen</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead>Last emailed</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && <EmptyRow colSpan={8}>No users match.</EmptyRow>}
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link href={`/superpanel/users/${u.id}`} className="font-medium hover:underline">{u.email || u.id}</Link>
                  <div className="text-xs text-muted-foreground">{u.name}{u.provider ? ` · ${u.provider}` : ""}</div>
                </TableCell>
                <TableCell><StageBadge stage={u.stage} /></TableCell>
                <TableCell className="whitespace-nowrap text-sm">{timeAgo(u.createdAt, now)}</TableCell>
                <TableCell className="whitespace-nowrap text-sm">{timeAgo(u.lastSignInAt, now)}</TableCell>
                <TableCell className="text-right tabular-nums">{u.credits}</TableCell>
                <TableCell className="text-right tabular-nums">{u.revenue ? formatMoney(u.revenue) : "—"}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{u.lastEmailedAt ? timeAgo(u.lastEmailedAt, now) : "—"}</TableCell>
                <TableCell className="text-right">
                  {u.email && (
                    <EmailDialogButton
                      userId={u.id}
                      recipient={{ name: u.name, email: u.email, credits: u.credits }}
                      template={STAGE_TEMPLATE[u.stage]}
                      context={emailContext}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pager basePath="/superpanel/users" params={{ q: params.q?.trim() || undefined, stage }} page={page} totalPages={totalPages} total={total} noun="users" />
    </div>
  );
}
