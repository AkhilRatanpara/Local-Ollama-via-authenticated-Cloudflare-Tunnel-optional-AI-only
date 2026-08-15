ALTER TABLE "schemes" ALTER COLUMN "benefits" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "schemes" ALTER COLUMN "benefits" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "schemes" ALTER COLUMN "eligibility" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "schemes" ALTER COLUMN "eligibility" SET DEFAULT '{}';
