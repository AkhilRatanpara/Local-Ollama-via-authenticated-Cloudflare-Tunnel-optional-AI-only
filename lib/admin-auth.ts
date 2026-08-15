import { getSession } from "@/lib/auth";

/**
 * Shared admin authentication helper for all admin API routes.
 * Uses the correct "session" cookie via getSession().
 * Returns the session payload if user is admin, null otherwise.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}
