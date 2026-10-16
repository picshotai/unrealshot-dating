"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ActionMessage from "@/components/admin/ActionMessage";
import { NativeSelect } from "@/components/admin/NativeSelect";
import { sendSegmentEmailAction, sendUserEmailAction } from "@/app/(protected)/superpanel/actions";
import { ADMIN_EMAIL_TEMPLATES, findTemplate } from "@/lib/admin/email/templates";
import { fillPlaceholders, renderEmailHtml } from "@/lib/admin/email/render";
import { newIdempotencyKey } from "@/lib/admin/format";
import type { ActionResult } from "@/lib/admin/types";

export type ComposerRecipient = { name: string; email: string; credits: number };
export type ComposerSegment = { key: string; label: string; count: number; template: string; sample: ComposerRecipient | null };

type Props = {
  sender: { from: string; replyTo: string };
  appUrl: string;
  defaultTemplate?: string;
  onSent?: () => void;
} & (
  | { mode: "user"; userId: string; recipient: ComposerRecipient }
  | { mode: "segment"; segments: ComposerSegment[]; defaultSegment?: string }
);

export default function EmailComposer(props: Props) {
  const isSegment = props.mode === "segment";
  const [segmentKey, setSegmentKey] = useState(isSegment ? props.defaultSegment ?? props.segments[0]?.key ?? "" : "");
  const segment = isSegment ? props.segments.find((s) => s.key === segmentKey) : undefined;

  const initialTemplate = findTemplate(props.defaultTemplate ?? (segment?.template || "blank"));
  const [templateKey, setTemplateKey] = useState(initialTemplate.key);
  const [subject, setSubject] = useState(initialTemplate.subject);
  const [body, setBody] = useState(initialTemplate.body);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);
  const [confirmCount, setConfirmCount] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const send = isSegment ? sendSegmentEmailAction : sendUserEmailAction;
    const result = await send(prev, formData);
    // A delivered send gets a fresh key so the next message isn't deduplicated by Resend.
    if (result?.ok && formData.get("intent") !== "test") {
      setIdempotencyKey(newIdempotencyKey());
      setConfirmCount("");
      props.onSent?.();
    }
    return result;
  }, null);

  const applyTemplate = (key: string) => {
    const t = findTemplate(key);
    setTemplateKey(t.key);
    setSubject(t.subject);
    setBody(t.body);
  };

  const previewRecipient: ComposerRecipient =
    props.mode === "user" ? props.recipient : segment?.sample ?? { name: "there", email: "someone@example.com", credits: 0 };
  const vars = { ...previewRecipient, app_url: props.appUrl };
  const previewHtml = useMemo(() => renderEmailHtml(fillPlaceholders(body, vars)), [body, vars.name, vars.email, vars.credits, vars.app_url]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="templateKey" value={templateKey} />
      {props.mode === "user" && <input type="hidden" name="userId" value={props.userId} />}

      <div className="grid gap-1 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
        <div><span className="text-foreground">From:</span> {props.sender.from}</div>
        <div><span className="text-foreground">Reply-to:</span> {props.sender.replyTo}</div>
        {props.mode === "user" && <div><span className="text-foreground">To:</span> {props.recipient.email}</div>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isSegment && (
          <div className="space-y-1.5">
            <Label htmlFor="segment">Recipients</Label>
            <NativeSelect
              id="segment"
              name="segment"
              className="w-full"
              value={segmentKey}
              onChange={(e) => {
                setSegmentKey(e.target.value);
                const next = props.segments.find((s) => s.key === e.target.value);
                if (next) applyTemplate(next.template);
              }}
            >
              {props.segments.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label} ({s.count})
                </option>
              ))}
            </NativeSelect>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="template">Template</Label>
          <NativeSelect id="template" className="w-full" value={templateKey} onChange={(e) => applyTemplate(e.target.value)}>
            {ADMIN_EMAIL_TEMPLATES.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} required />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="body">Message</Label>
          <button type="button" className="text-xs text-muted-foreground underline-offset-2 hover:underline" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="overflow-hidden rounded-md border bg-white">
            <div className="border-b bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
              {fillPlaceholders(subject, vars) || "(no subject)"} · to {previewRecipient.email}
            </div>
            <iframe title="Email preview" srcDoc={previewHtml} sandbox="" className="h-80 w-full" />
          </div>
        ) : (
          <Textarea id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="font-mono text-sm" required />
        )}
        {showPreview && <input type="hidden" name="body" value={body} />}
        <p className="text-xs text-muted-foreground">
          Placeholders: {"{{name}}"}, {"{{email}}"}, {"{{credits}}"}, {"{{app_url}}"}. Blank line = new paragraph, **bold**, links auto-detected.
        </p>
      </div>

      {isSegment && segment && (
        <div className="space-y-1.5">
          <Label htmlFor="confirmCount">Type {segment.count} to confirm sending to everyone in this segment</Label>
          <Input
            id="confirmCount"
            name="confirmCount"
            inputMode="numeric"
            value={confirmCount}
            onChange={(e) => setConfirmCount(e.target.value)}
            className="max-w-40"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" name="intent" value="send" disabled={pending || (isSegment && (!segment || Number(confirmCount) !== segment.count))}>
          {pending ? "Sending…" : isSegment ? `Send to ${segment?.count ?? 0}` : "Send email"}
        </Button>
        <Button type="submit" name="intent" value="test" variant="outline" disabled={pending}>
          Send test to me
        </Button>
        <ActionMessage result={state} />
      </div>
    </form>
  );
}
