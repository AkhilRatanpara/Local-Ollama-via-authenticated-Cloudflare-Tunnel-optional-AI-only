import { db } from "@/db";
import { schemes } from "@/db/schemas/scheme";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET: all schemes for admin (all statuses)
export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search") || "";

    const allSchemes = await db.select().from(schemes).orderBy(desc(schemes.createdAt));

    const filtered = allSchemes.filter(s => {
      const matchType = !type || type === "all" || s.type === type;
      const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
        (s.category || "").toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });

    return NextResponse.json({ schemes: filtered });
  } catch (error) {
    console.error("Admin schemes GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: create new scheme
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    // Remove undefined/null fields to avoid DB type errors
    const cleanBody: Record<string, any> = {};
    for (const [k, v] of Object.entries(body)) {
      if (v !== undefined && v !== null && v !== "") {
        cleanBody[k] = v;
      }
    }

    const newScheme = await db.insert(schemes).values({
      ...cleanBody,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any).returning();

    return NextResponse.json({ scheme: newScheme[0] }, { status: 201 });
  } catch (error) {
    console.error("Admin scheme POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH: update or toggle status
export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Clean undefined values
    const cleanUpdates: Record<string, any> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleanUpdates[k] = v;
    }

    const updated = await db.update(schemes)
      .set({ ...cleanUpdates, updatedAt: new Date() })
      .where(eq(schemes.id, id))
      .returning();
    return NextResponse.json({ scheme: updated[0] });
  } catch (error) {
    console.error("Admin scheme PATCH error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE: remove scheme
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.delete(schemes).where(eq(schemes.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin scheme DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
