ALTER TABLE "order_addresses" DROP CONSTRAINT "order_addresses_municipality_id_municipalities_id_fk";
--> statement-breakpoint
ALTER TABLE "ordered_products" DROP CONSTRAINT "ordered_products_order_id_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "order_payment_methods_except_delivery_methods" DROP CONSTRAINT "order_payment_methods_except_delivery_methods_payment_method_id_order_payment_methods_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts_to_post_categories" DROP CONSTRAINT "posts_to_post_categories_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "preview_subscriber_tokens" DROP CONSTRAINT "preview_subscriber_tokens_for_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_prices" DROP CONSTRAINT "product_prices_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "product_stock" DROP CONSTRAINT "product_stock_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe_images" DROP CONSTRAINT "recipe_images_recipe_id_recipes_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe_resources" DROP CONSTRAINT "recipe_resources_recipe_id_recipes_id_fk";
--> statement-breakpoint
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe_steps" DROP CONSTRAINT "recipe_steps_recipe_id_recipes_id_fk";
--> statement-breakpoint
ALTER TABLE "telephone_numbers" DROP CONSTRAINT "telephone_numbers_code_telephone_number_codes_code_fk";
--> statement-breakpoint
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_municipality_id_municipalities_id_fk";
--> statement-breakpoint
ALTER TABLE "user_cart_products" DROP CONSTRAINT "user_cart_products_cart_id_user_carts_id_fk";
--> statement-breakpoint
ALTER TABLE "user_carts" DROP CONSTRAINT "user_carts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_liked_posts" DROP CONSTRAINT "user_liked_posts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_liked_recipes" DROP CONSTRAINT "user_liked_recipes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_telephone_id_telephone_numbers_id_fk";
--> statement-breakpoint
ALTER TABLE "user_cart_products" ALTER COLUMN "count" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "order_delivery_methods" ADD COLUMN "slug" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_payment_methods" ADD COLUMN "slug" varchar(256) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_municipality_id_municipalities_id_fk" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_payment_methods_except_delivery_methods" ADD CONSTRAINT "order_payment_methods_except_delivery_methods_payment_method_id_order_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "order_payment_methods"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_to_post_categories" ADD CONSTRAINT "posts_to_post_categories_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preview_subscriber_tokens" ADD CONSTRAINT "preview_subscriber_tokens_for_user_id_users_id_fk" FOREIGN KEY ("for_user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_stock" ADD CONSTRAINT "product_stock_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_images" ADD CONSTRAINT "recipe_images_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_resources" ADD CONSTRAINT "recipe_resources_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "telephone_numbers" ADD CONSTRAINT "telephone_numbers_code_telephone_number_codes_code_fk" FOREIGN KEY ("code") REFERENCES "telephone_number_codes"("code") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_municipality_id_municipalities_id_fk" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_cart_products" ADD CONSTRAINT "user_cart_products_cart_id_user_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "user_carts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_carts" ADD CONSTRAINT "user_carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_liked_posts" ADD CONSTRAINT "user_liked_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_liked_recipes" ADD CONSTRAINT "user_liked_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_telephone_id_telephone_numbers_id_fk" FOREIGN KEY ("telephone_id") REFERENCES "telephone_numbers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
