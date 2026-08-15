import { pgTable, text, uuid, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").unique().notNull(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;

// Default settings keys:
// nav_schemes_enabled: true
// nav_loans_enabled: true
// nav_subsidies_enabled: true
// nav_news_enabled: true
// chatbot_enabled: true
