import { db } from "@/db";
import { news } from "@/db/schemas/news";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allNews = await db.select().from(news).orderBy(desc(news.createdAt));
    return NextResponse.json(allNews, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
