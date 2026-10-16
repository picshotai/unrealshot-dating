import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyRow, FilterTabs } from "@/components/admin/AdminUi";
import EmailDialogButton from "@/components/admin/EmailDialogButton";
import { Pager, paginate, parsePage } from "@/components/admin/Pager";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/admin/guard";
import { getUserSummaries, isAbandonedPayment, listPayments, getRequestNow } from "@/lib/admin/data";
import { adminEmailContext } from "@/lib/admin/email/send";
import { formatDate, formatMoney } from "@/lib/admin/format";

const FILTERS = ["", "completed", "abandoned", "pending", "failed"] as const;
const LABELS: Record<string, string> = { "": "All", completed: "Completed", abandoned: "Abandoned", pending: "Pending", failed: "Failed" };

export default async function SuperPanelPayments({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireAdminPage();
  const { status: raw, page: rawPage } = await searchParams;
  const status = FILTERS.includes(raw as (typeof FILTERS)[number]) ? (raw as string) : "";

  const [all, filtered, users] = await Promise.all([listPayments(), listPayments(status || undefined), getUserSummaries()]);
  const { items: rows, page, totalPages, total } = paginate(filtered, parsePage(rawPage));
  const byId = new Map(users.map((u) => [u.id, u]));
  const emailContext = adminEmailContext();
  const now = getRequestNow();

  const counts = await Promise.all(FILTERS.map((f) => (f ? listPayments(f).then((r) => r.length) : all.length)));

  return (
    <div className="space-y-4">
      <FilterTabs
        base="/superpanel/payments"
        current={status}
        options={FILTERS.map((f, i) => ({ value: f, label: LABELS[f], count: counts[i] }))}
      />
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Dodo payment</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && <EmptyRow colSpan={7}>No payments.</EmptyRow>}
            {rows.map((p) => {
              const user = byId.get(p.user_id);
              const abandoned = isAbandonedPayment(p, now);
              return (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(p.created_at)}</TableCell>
                  <TableCell>
                    <Link href={`/superpanel/users/${p.user_id}`} className="hover:underline">{user?.email ?? p.user_id}</Link>
                  </TableCell>
                  <TableCell>{formatMoney(Number(p.amount), p.currency)}</TableCell>
                  <TableCell><StatusBadge status={abandoned ? "abandoned" : p.status} /></TableCell>
                  <TableCell className="tabular-nums">{p.credits ?? 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.dodo_payment_id ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {user?.email && (
                      <EmailDialogButton
                        userId={user.id}
                        recipient={{ name: user.name, email: user.email, credits: user.credits }}
                        template={p.status === "completed" ? "purchase_thanks" : "abandoned_checkout"}
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
      <Pager basePath="/superpanel/payments" params={{ status }} page={page} totalPages={totalPages} total={total} noun="payments" />
    </div>
  );
}
