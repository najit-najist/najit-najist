DO $$ BEGIN
 CREATE TYPE "public"."packeta_parcel_Types" AS ENUM('external', 'internal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "packeta_parcels" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"address_id" varchar NOT NULL,
	"address_type" "packeta_parcel_Types" NOT NULL,
	"packet_id" bigint NOT NULL,
	"packet_barcode_raw" varchar NOT NULL,
	"packet_barcode_pretty" varchar NOT NULL,
	"order_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comgate_payments" ADD COLUMN "redirect_url" varchar(1000);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "packeta_parcels" ADD CONSTRAINT "packeta_parcels_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
