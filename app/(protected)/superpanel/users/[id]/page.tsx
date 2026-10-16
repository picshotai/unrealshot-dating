import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyRow, Section } from "@/components/admin/AdminUi";
import CopyTextButton from "@/components/admin/CopyTextButton";
import CreditAdjustForm from "@/components/admin/CreditAdjustForm";
import EmailDialogButton from "@/components/admin/EmailDialogButton";
import RefundStateForm from "@/components/admin/RefundStateForm";
import { StageBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/admin/guard";
import { getUserDetail, getUserSummaries, isAbandonedPayment, getRequestNow } from "@/lib/admin/data";
import { adminEmailContext } from "@/lib/admin/email/send";
import { formatDate, formatMoney, shortId, timeAgo } from "@/lib/admin/format";
import { STAGE_TEMPLATE } from "@/lib/admin/segments";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default async function SuperPanelUser({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [detail, summaries] = await Promise.all([getUserDetail(id), getUserSummaries()]);
  if (!detail) notFound();
  const summary = summaries.find((s) => s.id === id);
  const { user } = detail;
  const emailContext = adminEmailContext();
  const now = getRequestNow();
  const recipient = { name: detail.name, email: user.email ?? "", credits: detail.credits };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link href="/superpanel/users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Users
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{user.email}</h2>
              {user.email && <CopyTextButton text={user.email} />}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {user.id} <CopyTextButton text={user.id} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {summary && <StageBadge stage={summary.stage} />}
            {user.email && (
              <EmailDialogButton
                userId={user.id}
                recipient={recipient}
                template={summary ? STAGE_TEMPLATE[summary.stage] : undefined}
                context={emailContext}
                label="Send email"
                size="default"
                variant="default"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border p-4 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Name">{detail.name}</Field>
            <Field label="Sign-in method">{(user.app_metadata?.provider as string) ?? "—"}</Field>
            <Field label="Signed up">{formatDate(user.created_at)}</Field>
            <Field label="Last sign-in">{user.last_sign_in_at ? `${timeAgo(user.last_sign_in_at, now)}` : "never"}</Field>
            <Field label="Email confirmed">{user.email_confirmed_at ? "yes" : "no"}</Field>
            <Field label="Lifetime revenue">{formatMoney(summary?.revenue ?? 0)}</Field>
            {detail.preferences && (
              <>
                <Field label="Vibe / style">{String(detail.preferences.vibe ?? "—")} / {String(detail.preferences.style ?? "—")}</Field>
                <Field label="Interests">
                  {Array.isArray(detail.preferences.interests) && detail.preferences.interests.length
                    ? (detail.preferences.interests as string[]).join(", ")
                    : "—"}
                </Field>
                <Field label="Hobby">{String(detail.preferences.hobby_text || "—")}</Field>
              </>
            )}
          </dl>
        </div>
        <div className="space-y-3 rounded-lg border p-4">
          <div>
            <div className="text-xs text-muted-foreground">Credit balance</div>
            <div className="text-3xl font-semibold tabular-nums">{detail.credits}</div>
          </div>
          <CreditAdjustForm userId={user.id} current={detail.credits} />
        </div>
      </div>

      <Section title="Payments">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Dodo payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.payments.length === 0 && <EmptyRow colSpan={5}>No payments.</EmptyRow>}
              {detail.payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(p.created_at)}</TableCell>
                  <TableCell>{formatMoney(Number(p.amount), p.currency)}</TableCell>
                  <TableCell><StatusBadge status={isAbandonedPayment(p, now) ? "abandoned" : p.status} /></TableCell>
                  <TableCell className="tabular-nums">{p.credits ?? 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.dodo_payment_id ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Shoots">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Failure</TableHead>
                <TableHead>Refund</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.orders.length === 0 && <EmptyRow colSpan={7}>No shoots yet.</EmptyRow>}
              {detail.orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{shortId(o.id)}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                    {o.pipeline_stage && <div className="mt-1 text-xs text-muted-foreground">{o.pipeline_stage}</div>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDate(o.created_at)}
                    {o.ready_at && <div className="text-xs text-muted-foreground">ready {timeAgo(o.ready_at, now)}</div>}
                  </TableCell>
                  <TableCell className="tabular-nums">{o.photos_target}</TableCell>
                  <TableCell className="text-xs">{o.credit_amount ?? "—"} · {o.credit_state ?? "—"}</TableCell>
                  <TableCell className="max-w-xs text-xs text-red-400">
                    {o.failure_code ? `${o.failure_code}${o.failure_phase ? ` (${o.failure_phase})` : ""}: ${o.failure_message ?? ""}` : "—"}
                  </TableCell>
                  <TableCell><RefundStateForm orderId={o.id} current={o.refund_state} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Emails sent" description="Everything sent to this user from the super panel.">
        <ul className="divide-y rounded-lg border">
          {detail.emails.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">
              {detail.emailLogMissing ? "Email log table not created yet." : "No emails sent yet."}
            </li>
          )}
          {detail.emails.map((e) => (
            <li key={e.id}>
              <details className="group p-3">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{e.subject}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <StatusBadge status={e.status} />
                    {formatDate(e.created_at)} · by {e.sent_by}
                  </span>
                </summary>
                <pre className="mt-3 whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-sans text-sm">{e.body_text}</pre>
                {e.error && <p className="mt-2 text-xs text-red-400">{e.error}</p>}
              </details>
            </li>
          ))}
        </ul>
      </Section>

      {detail.audit.length > 0 && (
        <Section title="Admin actions">
          <ul className="divide-y rounded-lg border text-sm">
            {detail.audit.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2 p-3">
                <span>
                  <span className="font-mono text-xs">{a.action}</span>{" "}
                  <span className="text-muted-foreground">{JSON.stringify(a.details)}</span>
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(a.created_at)} · {a.actor_email}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
