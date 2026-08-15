import { pgTable, text, timestamp, boolean, uuid, integer, real } from "drizzle-orm/pg-core";
import { users } from "./user";

export const schemes = pgTable("schemes", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Basic Info
  title: text("title").notNull(),
  ministry: text("ministry").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Agriculture, Education, Health, etc.
  type: text("type").notNull(), // Subsidy, Loan, Scholarship, Pension, etc.
  state: text("state").default("Central").notNull(), // "Central" or State Name
  
  // Benefits & Eligibility
  benefits: text("benefits").array().default([]).notNull(), // Array of benefits bullet points
  eligibility: text("eligibility").array().default([]).notNull(), // Array of eligibility criteria bullet points
  documentsRequired: text("documents_required").array(), // Array of document names
  amount: real("amount"), // Monetary benefit amount if applicable
  shortBenefits: text("short_benefits"), // E.g., "₹60,000 Scholarship"
  
  // Loan-specific details (Nullable)
  interestRate: real("interest_rate"),
  tenureMax: integer("tenure_max"), // in months
  collateralRequired: boolean("collateral_required"),
  moratoriumMonths: integer("moratorium_months"),
  interestSubvention: real("interest_subvention"),
  lendingPartners: text("lending_partners").array(),

  // Subsidy-specific details (Nullable)
  subsidyPercentage: real("subsidy_percentage"),
  subsidyMaxAmount: real("subsidy_max_amount"),
  dbtStatus: boolean("dbt_status"),
  vendorEmpanelled: boolean("vendor_empanelled"),

  // Criteria (for smart filtering)
  gender: text("gender").default("All"), // All, Male, Female, Transgender
  ageMin: integer("age_min"),
  ageMax: integer("age_max"),
  incomeLimit: real("income_limit"), // Annual income limit
  caste: text("caste").array(), // ["SC", "ST", "OBC", "General"]
  residence: text("residence").default("Both"), // Urban, Rural, Both

  // dates & Status
  deadline: timestamp("deadline", { mode: "date" }),
  status: text("status", { enum: ["active", "closed", "upcoming"] }).default("active").notNull(),
  
  // Meta
  applicationUrl: text("application_url"),
  tags: text("tags").array(), // Search tags
  applicationsCount: integer("applications_count").default(0),
  
  // Relations
  createdBy: uuid("created_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Scheme = typeof schemes.$inferSelect;
export type NewScheme = typeof schemes.$inferInsert;
