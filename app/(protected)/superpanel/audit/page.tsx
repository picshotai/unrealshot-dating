import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyRow } from "@/components/admin/AdminUi";
import { Pager, paginate, parsePage } from "@/components/admin/Pager";
import { requireAdminPage } from "@/lib/admin/guard";
import { emailMapForUsers, listAuditLog } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/format";

export default async function SuperPanelAudit({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdminPage();
  const { page: rawPage } = await searchParams;
  const [audit, emails] = await Promise.all([listAuditLog(2000), emailMapForUsers()]);
  const entries = paginate(audit.rows, parsePage(rawPage));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.total === 0 && (
              <EmptyRow colSpan={5}>{audit.missing ? "Audit table not created yet. Run migration 043." : "No admin actions recorded yet."}</EmptyRow>
            )}
            {entries.items.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="whitespace-nowrap text-sm">{formatDate(a.created_at)}</TableCell>
                <TableCell className="text-sm">{a.actor_email}</TableCell>
                <TableCell className="font-mono text-xs">{a.action}</TableCell>
                <TableCell className="text-sm">
                  {a.target_user_id ? (
                    <Link href={`/superpanel/users/${a.target_user_id}`} className="hover:underline">
                      {emails.get(a.target_user_id) ?? a.target_user_id}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="max-w-md text-xs text-muted-foreground">{JSON.stringify(a.details)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pager basePath="/superpanel/audit" params={{}} page={entries.page} totalPages={entries.totalPages} total={entries.total} noun="entries" />
    </div>
  );
}
