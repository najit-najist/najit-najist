CREATE TABLE IF NOT EXISTS "orders_local_pickup_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"date" timestamp with time zone,
	"order_id" integer NOT NULL,
	CONSTRAINT "orders_local_pickup_dates_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders_local_pickup_dates" ADD CONSTRAINT "orders_local_pickup_dates_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
