import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("🔔"),
  schemeId: uuid("scheme_id"), // Optional: Link to the scheme if it's a "New Scheme" news item
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
