ALTER TABLE "orders" ADD COLUMN "invoice_address_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "ico" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "dic" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_invoice_address_id_order_addresses_id_fk" FOREIGN KEY ("invoice_address_id") REFERENCES "public"."order_addresses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
