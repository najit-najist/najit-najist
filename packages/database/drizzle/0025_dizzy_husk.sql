ALTER TABLE "products" ADD COLUMN "price" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "products" AS v
SET price = s.value
FROM "product_prices" AS s
WHERE s.product_id = v.id;--> statement-breakpoint
