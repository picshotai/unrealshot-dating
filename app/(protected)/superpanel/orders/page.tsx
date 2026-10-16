import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyRow, FilterTabs } from "@/components/admin/AdminUi";
import EmailDialogButton from "@/components/admin/EmailDialogButton";
import { Pager, paginate, parsePage } from "@/components/admin/Pager";
import RefundStateForm from "@/components/admin/RefundStateForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/admin/guard";
import { getUserSummaries, listOrders, getRequestNow } from "@/lib/admin/data";
import { adminEmailContext } from "@/lib/admin/email/send";
import { formatDate, shortId, timeAgo } from "@/lib/admin/format";

const FILTERS = ["", "active", "ready", "failed"] as const;
const LABELS: Record<string, string> = { "": "All", active: "In progress", ready: "Delivered", failed: "Failed" };

export default async function SuperPanelOrders({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireAdminPage();
  const { status: raw, page: rawPage } = await searchParams;
  const status = FILTERS.includes(raw as (typeof FILTERS)[number]) ? (raw as string) : "";

  const [filtered, users, counts] = await Promise.all([
    listOrders(status || undefined),
    getUserSummaries(),
    Promise.all(FILTERS.map((f) => listOrders(f || undefined).then((r) => r.length))),
  ]);
  const { items: rows, page, totalPages, total } = paginate(filtered, parsePage(rawPage));
  const byId = new Map(users.map((u) => [u.id, u]));
  const emailContext = adminEmailContext();
  const now = getRequestNow();

  return (
    <div className="space-y-4">
      <FilterTabs
        base="/superpanel/orders"
        current={status}
        options={FILTERS.map((f, i) => ({ value: f, label: LABELS[f], count: counts[i] }))}
      />
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Failure</TableHead>
              <TableHead>Refund</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && <EmptyRow colSpan={8}>No shoots.</EmptyRow>}
            {rows.map((o) => {
              const user = byId.get(o.user_id);
              return (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs" title={o.id}>{shortId(o.id)}</TableCell>
                  <TableCell>
                    <Link href={`/superpanel/users/${o.user_id}`} className="hover:underline">{user?.email ?? o.user_id}</Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                    {o.pipeline_stage && <div className="mt-1 text-xs text-muted-foreground">{o.pipeline_stage}</div>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDate(o.created_at)}
                    {o.ready_at && <div className="text-xs text-muted-foreground">ready {timeAgo(o.ready_at, now)}</div>}
                  </TableCell>
                  <TableCell className="tabular-nums">{o.photos_target}</TableCell>
                  <TableCell className="max-w-xs text-xs text-red-400">
                    {o.failure_code ? `${o.failure_code}: ${o.failure_message ?? ""}` : "—"}
                  </TableCell>
                  <TableCell><RefundStateForm orderId={o.id} current={o.refund_state} /></TableCell>
                  <TableCell className="text-right">
                    {user?.email && (
                      <EmailDialogButton
                        userId={user.id}
                        recipient={{ name: user.name, email: user.email, credits: user.credits }}
                        template={o.status === "ready" ? "shoot_feedback" : o.status === "queued" || o.status === "developing" ? "purchase_thanks" : "shoot_failed"}
                        context={emailContext}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Pager basePath="/superpanel/orders" params={{ status }} page={page} totalPages={totalPages} total={total} noun="shoots" />
    </div>
  );
}
