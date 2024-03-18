ALTER TABLE "recipe_resources" DROP CONSTRAINT "recipe_resources_title_unique";--> statement-breakpoint
ALTER TABLE "recipe_resources" ADD CONSTRAINT "title_for_recipe" UNIQUE("recipe_id","title");