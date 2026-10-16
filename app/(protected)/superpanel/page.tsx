import Link from "next/link";
import { CreditCard, ShoppingCart, Sparkles, TriangleAlert, UserPlus } from "lucide-react";
import { Section, StatCard } from "@/components/admin/AdminUi";
import EmailDialogButton from "@/components/admin/EmailDialogButton";
import { Pager, paginate, parsePage } from "@/components/admin/Pager";
import { requireAdminPage } from "@/lib/admin/guard";
import { getActivity, getOverview, getUserSummaries, getRequestNow } from "@/lib/admin/data";
import { adminEmailContext } from "@/lib/admin/email/send";
import { formatMoney, timeAgo } from "@/lib/admin/format";
import { ACTIVITY_TEMPLATE } from "@/lib/admin/segments";
import type { ActivityEvent } from "@/lib/admin/types";

const KIND_META: Record<ActivityEvent["kind"], { label: string; icon: typeof UserPlus; tone: string }> = {
  signup: { label: "Signed up", icon: UserPlus, tone: "text-sky-400" },
  purchase: { label: "Purchased", icon: CreditCard, tone: "text-emerald-400" },
  checkout_abandoned: { label: "Abandoned checkout", icon: ShoppingCart, tone: "text-amber-400" },
  shoot_ready: { label: "Shoot delivered", icon: Sparkles, tone: "text-emerald-400" },
  shoot_failed: { label: "Shoot failed", icon: TriangleAlert, tone: "text-red-400" },
};

export default async function SuperPanelOverview({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdminPage();
  const { page: rawPage } = await searchParams;
  const [stats, allActivity, users] = await Promise.all([getOverview(), getActivity(), getUserSummaries()]);
  const { items: activity, page, totalPages, total } = paginate(allActivity, parsePage(rawPage), 20);
  const byId = new Map(users.map((u) => [u.id, u]));
  const emailContext = adminEmailContext();
  const now = getRequestNow();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Users" value={stats.totalUsers} hint={`+${stats.signups24h} today · +${stats.signups7d} this week`} href="/superpanel/users" />
        <StatCard
          label="Customers"
          value={stats.customers}
          hint={`${(stats.conversionRate * 100).toFixed(1)}% conversion`}
          href="/superpanel/users"
        />
        <StatCard label="Revenue" value={formatMoney(stats.revenueTotal)} hint={`${formatMoney(stats.revenue30d)} last 30 days`} href="/superpanel/payments?status=completed" />
        <StatCard label="Purchases (7d)" value={stats.purchases7d} hint={`${stats.abandonedCheckouts} abandoned checkouts`} href="/superpanel/payments?status=abandoned" />
        <StatCard label="Shoots in progress" value={stats.activeOrders} href="/superpanel/orders?status=active" />
        <StatCard label="Shoots delivered" value={stats.ordersByStatus.ready ?? 0} href="/superpanel/orders?status=ready" />
        <StatCard label="Shoots failed" value={stats.failedOrders} hint={stats.failedOrders ? "Needs attention" : undefined} href="/superpanel/orders?status=failed" />
        <StatCard label="Unspent credits" value={stats.outstandingCredits} hint="Across all users" />
      </div>

      <Section title="Activity" description="Newest signups, purchases and shoots. Email anyone straight from here.">
        <ul className="divide-y rounded-lg border">
          {activity.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No activity yet.</li>}
          {activity.map((event) => {
            const meta = KIND_META[event.kind];
            const Icon = meta.icon;
            const user = byId.get(event.userId);
            const emailedSince = event.lastEmailedAt && event.lastEmailedAt >= event.at;
            return (
              <li key={event.key} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.tone}`} />
                  <div className="min-w-0">
                    <div className="text-sm">
                      <Link href={`/superpanel/users/${event.userId}`} className="font-medium hover:underline">
                        {event.email}
                      </Link>{" "}
                      <span className="text-muted-foreground">{meta.label.toLowerCase()}</span>
                      {event.detail && <span className="text-muted-foreground"> · {event.detail}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {timeAgo(event.at, now)}
                      {emailedSince && <span className="text-emerald-400"> · emailed {timeAgo(event.lastEmailedAt, now)}</span>}
                    </div>
                  </div>
                </div>
                {user && (
                  <EmailDialogButton
                    userId={user.id}
                    recipient={{ name: user.name, email: user.email, credits: user.credits }}
                    template={ACTIVITY_TEMPLATE[event.kind]}
                    context={emailContext}
                  />
                )}
              </li>
            );
          })}
        </ul>
        <Pager basePath="/superpanel" params={{}} page={page} totalPages={totalPages} total={total} noun="events" />
      </Section>
    </div>
  );
}
