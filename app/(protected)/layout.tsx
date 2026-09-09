import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { HeaderUser } from "@/components/dashboard/header-user"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LoadingProvider } from "@/components/loading-provider"
import { NavigationProgress } from "@/components/navigation-progress"
import { createClient } from "@/utils/supabase/server"
import { creditService } from "@/lib/credits"
import { redirect } from "next/navigation"
import ClarityInit from "@/components/ClarityInit"
import { isAdminEmail } from "@/lib/auth/admin-access"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Fetch user's credit balance for header display
  const { balance: creditBalance } = await creditService.getUserCredits(user.id)
  return (
    <div className="protected-scope dark bg-background text-foreground">
      <NavigationProgress />
      <ClarityInit projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ""} userId={user.id} />
      <SidebarProvider>
        <AppSidebar
          showPromptLab={isAdminEmail(user.email)}
          user={{
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
            id: user.id,
          }}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
            <div className="px-4">
              <HeaderUser
                user={{
                  name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                  email: user.email || '',
                  avatar: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
                  id: user.id,
                }}
                initialCreditBalance={creditBalance}
              />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
