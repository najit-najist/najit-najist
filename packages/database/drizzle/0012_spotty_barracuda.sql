CREATE TABLE IF NOT EXISTS "coupon_patches" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"coupon_id" integer NOT NULL,
	"reduction_price" integer DEFAULT 0,
	"reduction_percentage" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"name" varchar(12) NOT NULL,
	"enabled" boolean DEFAULT true,
	"valid_from" date,
	"valid_to" date,
	CONSTRAINT "coupons_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "coupon_patch_id" integer;--> statement-breakpoint
ALTER TABLE "user_carts" ADD COLUMN "coupon_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coupon_patches" ADD CONSTRAINT "coupon_patches_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coupons_name_idx" ON "coupons" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_patch_id_coupon_patches_id_fk" FOREIGN KEY ("coupon_patch_id") REFERENCES "public"."coupon_patches"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_carts" ADD CONSTRAINT "user_carts_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
