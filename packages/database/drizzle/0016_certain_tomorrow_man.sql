ALTER TABLE "coupon_patches" DROP CONSTRAINT "coupon_patches_coupon_id_coupons_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coupon_patches" ADD CONSTRAINT "coupon_patches_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
