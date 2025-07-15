CREATE TABLE IF NOT EXISTS "one_time_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"token_hash" text NOT NULL,
	"relates_to" text NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
