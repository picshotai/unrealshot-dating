"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/superpanel", label: "Overview" },
  { href: "/superpanel/users", label: "Users" },
  { href: "/superpanel/payments", label: "Payments" },
  { href: "/superpanel/orders", label: "Shoots" },
  { href: "/superpanel/emails", label: "Emails" },
  { href: "/superpanel/audit", label: "Audit log" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      className="-mx-1 flex gap-1 overflow-x-auto border-b pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:[mask-image:linear-gradient(to_right,black_85%,transparent)]"
      aria-label="Super panel sections"
    >
      {TABS.map((tab) => {
        const active = tab.href === "/superpanel" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors",
              active ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
