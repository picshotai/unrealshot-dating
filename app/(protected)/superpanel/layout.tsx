import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { MigrationNotice } from "@/components/admin/AdminUi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { requireAdminPage } from "@/lib/admin/guard";
import { adminDataSince, isEmailLogAvailable } from "@/lib/admin/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Super Panel", robots: { index: false, follow: false } };

export default async function SuperPanelLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireAdminPage();

  let setupError: string | null = null;
  let emailLogReady = true;
  try {
    emailLogReady = await isEmailLogAvailable();
  } catch (err) {
    setupError = err instanceof Error ? err.message : String(err);
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-2 [color-scheme:dark] [&_*]:[scrollbar-width:thin] [&_*]:[scrollbar-color:rgb(63_63_70)_transparent]">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Super Panel</h1>
          <p className="text-sm text-muted-foreground">Signed in as {actor.email}. Hidden from non-admins.</p>
          <p className="text-xs text-muted-foreground">
            Showing data since {new Date(adminDataSince()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })} (dating photoshoot launch). Older records are ignored.
          </p>
        </div>
      </header>
      <AdminNav />
      {setupError ? (
        <Alert variant="destructive">
          <AlertTitle>Admin data unavailable</AlertTitle>
          <AlertDescription>
            {setupError}. Check <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {!emailLogReady && <MigrationNotice />}
          {children}
        </>
      )}
    </div>
  );
}
