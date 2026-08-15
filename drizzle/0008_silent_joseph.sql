ALTER TABLE "schemes" ADD COLUMN "short_benefits" text;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "interest_rate" real;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "tenure_max" integer;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "collateral_required" boolean;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "moratorium_months" integer;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "interest_subvention" real;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "lending_partners" text[];--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "subsidy_percentage" real;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "subsidy_max_amount" real;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "dbt_status" boolean;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "vendor_empanelled" boolean;