"use client"

import * as React from "react"
import {
  Send,
  SquareTerminal,
  Coins,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Sparkles as SparklesIcon,
  FolderOpen,
  ImagePlayIcon,
  DamIcon,
  DatabaseBackup,
  ImagePlus,
  MessageCircleCodeIcon,
  WandSparklesIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCreditManager } from "@/lib/credit-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { packsFromCredits } from "@/lib/dating/types"

const navSecondary = [
  {
    title: "Support",
    url: "mailto:support@unrealshot.com",
    icon: Send,
  },
]

// Credits Card Component
function CreditsCard({ userId }: { userId?: string }) {
  const { balance, loading } = useCreditManager(userId || null)

  if (loading) {
    return (
      <Card className="mb-4 py-2">
        <CardContent className="p-3">
          <div className="text-sm font-medium mb-1">Your shoots</div>
          <div className="text-xs text-muted-foreground mb-3 justify-between">Loading...</div>
          <div className="w-full h-8 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const packs = packsFromCredits(balance)

  return (
    <Card className="py-2">
      <CardContent className="gap-1 flex flex-col px-3">
        <div className="text-sm font-medium mb-1">Your shoots</div>
        <div className="text-xs text-muted-foreground mb-3 flex justify-between">
          <span className="flex items-center gap-2"><Coins className="h-3 w-3" />Packs</span> <span className="text-amber-600"> {packs}</span>
        </div>
        <Button size="sm" className="w-full bg-white text-black hover:bg-zinc-200 transition-all active:scale-[0.98] border-0" asChild>
          <Link href="/buy-credits" prefetch={false}>
            <Sparkles className="h-3 w-3" /> {packs > 0 ? "Get another pack" : "Get your pack"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
    id?: string
  }
}) {
  const userData = user || {
    name: "User",
    email: "user@example.com",
    avatar: "/placeholder-user.jpg",
  }

  // A `hasTrainedModel` query used to run here on every protected page render.
  // Nothing read the result, and it filtered on status 'finished' — a value this
  // codebase never writes — so it was always false anyway. Model gating now
  // happens at the edge in proxy.ts.

  const navItems = React.useMemo(() => [
    {
      title: "Dating Photoshoot",
      url: "/dating-shoot",
      icon: WandSparklesIcon,
      isActive: true,
    },
    {
      title: "Create Model",
      url: "/models/create",
      icon: ImagePlus,
    },
    {
      title: "My Gallery",
      url: "/gallery",
      icon: ImagePlayIcon,
    },
    {
      title: "My Models",
      url: "/models",
      icon: DatabaseBackup,
    },
  ], [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" prefetch={false}>
                <Image src="/site-logo.png" alt="Unrealshot AI" width={30} height={30} className="rounded-sm" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Unrealshot AI</span>
                  <span className="truncate text-xs">Realistic AI Photoshoots</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <CreditsCard userId={userData.id} />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
