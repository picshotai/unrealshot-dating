import type React from "react"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen cursor-auto font-[family-name:var(--font-inter)] bg-[#F7F5F3] text-gray-900 selection:bg-[#ff6f00]/20 selection:text-gray-900">
            {children}
        </div>
    )
}


