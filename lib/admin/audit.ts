import "server-only";
import { adminDb } from "./data";

/** Best-effort: an audit write failing (e.g. migration not applied) never blocks the action. */
export async function recordAudit(
  actorEmail: string,
  action: string,
  targetUserId: string | null,
  details: Record<string, unknown> = {}
) {
  const { error } = await adminDb()
    .from("admin_audit_log")
    .insert({ actor_email: actorEmail, action, target_user_id: targetUserId, details });
  if (error) console.error("[superpanel] audit write failed", action, error.message);
}
