import Link from "next/link";
import { Section } from "@/components/admin/AdminUi";
import EmailComposer, { type ComposerSegment } from "@/components/admin/EmailComposer";
import { Pager, paginate, parsePage } from "@/components/admin/Pager";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage } from "@/lib/admin/guard";
import { getUserSummaries, listEmailLogs } from "@/lib/admin/data";
import { adminEmailContext } from "@/lib/admin/email/send";
import { formatDate } from "@/lib/admin/format";
import { SEGMENTS, filterSegment, isSegmentKey } from "@/lib/admin/segments";

export default async function SuperPanelEmails({ searchParams }: { searchParams: Promise<{ segment?: string; page?: string }> }) {
  await requireAdminPage();
  const { segment, page: rawPage } = await searchParams;
  const [users, logs] = await Promise.all([getUserSummaries(), listEmailLogs(2000)]);
  const sent = paginate(logs.rows, parsePage(rawPage));
  const { sender, appUrl } = adminEmailContext();

  const segments: ComposerSegment[] = SEGMENTS.map((s) => {
    const members = filterSegment(users, s.key);
    const sample = members[0];
    return {
      key: s.key,
      label: s.label,
      count: members.length,
      template: s.template,
      sample: sample ? { name: sample.name, email: sample.email, credits: sample.credits } : null,
    };
  });

  return (
    <div className="space-y-10">
      <Section
        title="Send to a segment"
        description="Each person gets their own personalized copy (no shared To/CC). To email one person, use the Email button on their row."
      >
        <div className="rounded-lg border p-4">
          <EmailComposer mode="segment" segments={segments} defaultSegment={isSegmentKey(segment) ? segment : undefined} sender={sender} appUrl={appUrl} />
        </div>
      </Section>

      <Section title="Sent emails" description="Every email sent from the super panel, newest first.">
        <ul className="divide-y rounded-lg border">
          {sent.total === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">
              {logs.missing ? "Email log table not created yet. Run migration 043." : "Nothing sent yet."}
            </li>
          )}
          {sent.items.map((e) => (
            <li key={e.id}>
              <details className="p-3">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 text-sm">
                    <span className="font-medium">{e.subject}</span>{" "}
                    <span className="text-muted-foreground">
                      to{" "}
                      {e.user_id ? (
                        <Link href={`/superpanel/users/${e.user_id}`} className="hover:underline">{e.to_email}</Link>
                      ) : (
                        e.to_email
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <StatusBadge status={e.status} />
                    {e.batch_id && <span>segment</span>}
                    {formatDate(e.created_at)}
                  </span>
                </summary>
                <pre className="mt-3 whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-sans text-sm">{e.body_text}</pre>
                <p className="mt-2 text-xs text-muted-foreground">
                  Sent by {e.sent_by}
                  {e.resend_id && <> · Resend ID <code>{e.resend_id}</code></>}
                </p>
                {e.error && <p className="mt-1 text-xs text-red-400">{e.error}</p>}
              </details>
            </li>
          ))}
        </ul>
        <Pager basePath="/superpanel/emails" params={{ segment }} page={sent.page} totalPages={sent.totalPages} total={sent.total} noun="emails" />
      </Section>
    </div>
  );
}
