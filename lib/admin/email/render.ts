export type EmailVariables = {
  name: string;
  email: string;
  credits: number | string;
  app_url: string;
};

export function fillPlaceholders(text: string, vars: EmailVariables) {
  return text.replace(/\{\{\s*(name|email|credits|app_url)\s*\}\}/g, (_, key: keyof EmailVariables) => String(vars[key] ?? ""));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(line: string) {
  return escapeHtml(line)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(https?:\/\/[^\s<]+[^\s<.,!?;:)])/g, '<a href="$1" style="color:#2563eb;">$1</a>');
}

/** Plain-text body → a simple personal-letter HTML email (no marketing chrome). */
export function renderEmailHtml(body: string) {
  const paragraphs = body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 16px;">${p.split("\n").map(inline).join("<br>")}</p>`)
    .join("\n");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;padding:24px 20px;color:#1f2937;font-size:15px;line-height:1.6;">
${paragraphs}
</div></body></html>`;
}

export function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://unrealshot.com")
  ).replace(/\/$/, "");
}
