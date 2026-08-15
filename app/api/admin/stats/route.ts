import { db } from "@/db";
import { schemes } from "@/db/schemas/scheme";
import { users } from "@/db/schemas/user";
import { news } from "@/db/schemas/news";
import { count, eq, and, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

    const [
      totalUsersRes,
      newUsersRes,
      totalSchemesRes,
      activeLoansRes,
      activeSubsidiesRes,
      activeSchemesRes,
      disabledRes,
      totalNewsRes,
    ] = await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
      db.select({ value: count() }).from(schemes),
      db.select({ value: count() }).from(schemes).where(and(eq(schemes.type, "Loan"), eq(schemes.status, "active"))),
      db.select({ value: count() }).from(schemes).where(and(eq(schemes.type, "Subsidy"), eq(schemes.status, "active"))),
      db.select({ value: count() }).from(schemes).where(and(eq(schemes.type, "Scheme"), eq(schemes.status, "active"))),
      db.select({ value: count() }).from(schemes).where(eq(schemes.status, "closed")),
      db.select({ value: count() }).from(news),
    ]);

    // Breakdown by category
    const categoryBreakdown = await db
      .select({ category: schemes.category, count: count() })
      .from(schemes)
      .groupBy(schemes.category)
      .orderBy(sql`count(*) desc`);

    // Breakdown by type
    const typeBreakdown = await db
      .select({ type: schemes.type, count: count() })
      .from(schemes)
      .groupBy(schemes.type);

    // Monthly additions (last 6 months)
    const monthlySchemes = await db
      .select({
        month: sql<string>`to_char(created_at, 'Mon')`,
        count: count(),
      })
      .from(schemes)
      .where(gte(schemes.createdAt, sixMonthsAgo))
      .groupBy(sql`to_char(created_at, 'Mon')`)
      .orderBy(sql`min(created_at)`);

    return NextResponse.json({
      stats: {
        totalUsers: Number(totalUsersRes[0].value),
        newUsersThisWeek: Number(newUsersRes[0].value),
        totalSchemes: Number(totalSchemesRes[0].value),
        activeLoans: Number(activeLoansRes[0].value),
        activeSubsidies: Number(activeSubsidiesRes[0].value),
        activeSchemes: Number(activeSchemesRes[0].value),
        disabledSchemes: Number(disabledRes[0].value),
        totalNews: Number(totalNewsRes[0].value),
      },
      categoryBreakdown: categoryBreakdown.map(c => ({ category: c.category, count: Number(c.count) })),
      typeBreakdown: typeBreakdown.map(t => ({ type: t.type, count: Number(t.count) })),
      monthlySchemes: monthlySchemes.map(m => ({ month: m.month, count: Number(m.count) })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
