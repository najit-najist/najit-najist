ALTER TABLE "contact_form_replies" DROP CONSTRAINT "contact_form_replies_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_form_replies" ADD CONSTRAINT "contact_form_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
