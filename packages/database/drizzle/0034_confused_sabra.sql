ALTER TABLE "order_addresses" DROP CONSTRAINT "order_addresses_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "address_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_order_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."order_addresses"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "order_addresses" DROP COLUMN IF EXISTS "order_id";