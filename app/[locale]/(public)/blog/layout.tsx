import type React from "react"

export default async function BlogLocaleGate({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await params
  return children
}
