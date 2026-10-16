export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email && adminEmails().includes(email.toLowerCase()));
}

/**
 * Stricter check for the super panel: the address must be on ADMIN_EMAILS and
 * verified. An unconfirmed signup that merely claims an admin address never
 * qualifies. Empty or missing ADMIN_EMAILS means nobody is an admin.
 */
export function isAdminUser(
  user?: { email?: string | null; email_confirmed_at?: string | null } | null
): boolean {
  return Boolean(user?.email_confirmed_at && isAdminEmail(user.email));
}
