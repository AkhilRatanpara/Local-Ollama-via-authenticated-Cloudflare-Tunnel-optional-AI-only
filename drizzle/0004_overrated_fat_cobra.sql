CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"icon" text DEFAULT '🔔' NOT NULL,
	"scheme_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "caste" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;