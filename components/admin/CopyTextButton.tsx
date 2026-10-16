"use client"

import { Copy } from "lucide-react"
import { useState } from "react"

export default function CopyTextButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore copy errors
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center justify-center rounded p-1 hover:bg-muted ${className || ""}`}
      aria-label="Copy to clipboard"
      title={copied ? "Copied!" : "Copy"}
    >
      <Copy className="h-4 w-4" />
    </button>
  )
}