import { db } from "@/db";
import { siteSettings } from "@/db/schemas/settings";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const DEFAULT_SETTINGS: Record<string, boolean> = {
  nav_schemes_enabled: true,
  nav_loans_enabled: true,
  nav_subsidies_enabled: true,
  nav_news_enabled: true,
  chatbot_enabled: true,
};

// GET: public — anyone can read settings so Navbar can filter itself
export async function GET() {
  try {
    const rows = await db.select().from(siteSettings);
    const settings: Record<string, any> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json({ settings });
  } catch {
    // If table doesn't exist yet, return defaults gracefully
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

// PATCH: admin only — update a single setting key
export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { key, value } = body;
    if (typeof key !== "string") return NextResponse.json({ error: "Missing key" }, { status: 400 });

    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
