"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EmailComposer, { type ComposerRecipient } from "@/components/admin/EmailComposer";

export type EmailContext = { sender: { from: string; replyTo: string }; appUrl: string };

export default function EmailDialogButton({
  userId,
  recipient,
  template,
  context,
  label = "Email",
  size = "sm",
  variant = "outline",
}: {
  userId: string;
  recipient: ComposerRecipient;
  template?: string;
  context: EmailContext;
  label?: string;
  size?: "sm" | "default";
  variant?: "outline" | "default" | "secondary" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size} variant={variant} className="gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email {recipient.name}</DialogTitle>
          <DialogDescription>Sent through Resend from your founder address. Replies go to your support inbox.</DialogDescription>
        </DialogHeader>
        {open && (
          <EmailComposer
            mode="user"
            userId={userId}
            recipient={recipient}
            defaultTemplate={template}
            sender={context.sender}
            appUrl={context.appUrl}
            onSent={() => setTimeout(() => setOpen(false), 1200)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
