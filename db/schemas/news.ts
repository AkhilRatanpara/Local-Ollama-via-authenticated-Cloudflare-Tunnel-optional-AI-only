import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("🔔"),
  schemeId: uuid("scheme_id"), // Optional: Link to the scheme if it's a "New Scheme" news item
  url: text("url"), // Optional link to external source (e.g. PIB)
  imageUrl: text("image_url"), // Optional image URL for news articles
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
