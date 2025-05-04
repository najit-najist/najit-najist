import { Migration } from '@mikro-orm/migrations';

export class Migration20250518114305 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "recipe_step" drop constraint if exists "recipe_step_title_unique";`);
    this.addSql(`alter table if exists "recipe_resource" drop constraint if exists "recipe_resource_title_unique";`);
    this.addSql(`alter table if exists "recipe_difficulty" drop constraint if exists "recipe_difficulty_slug_unique";`);
    this.addSql(`alter table if exists "recipe_difficulty" drop constraint if exists "recipe_difficulty_name_unique";`);
    this.addSql(`alter table if exists "recipe_category" drop constraint if exists "recipe_category_slug_unique";`);
    this.addSql(`alter table if exists "recipe_category" drop constraint if exists "recipe_category_title_unique";`);
    this.addSql(`alter table if exists "recipe" drop constraint if exists "recipe_slug_unique";`);
    this.addSql(`alter table if exists "recipe" drop constraint if exists "recipe_title_unique";`);
    this.addSql(`create table if not exists "recipe" ("id" text not null, "title" text not null, "slug" text not null, "description" text not null, "numberOfPortions" integer not null default 1, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recipe_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_title_unique" ON "recipe" (title) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_slug_unique" ON "recipe" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recipe_deleted_at" ON "recipe" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recipe_category" ("id" text not null, "title" text not null, "slug" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recipe_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_category_title_unique" ON "recipe_category" (title) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_category_slug_unique" ON "recipe_category" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recipe_category_deleted_at" ON "recipe_category" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recipe_difficulty" ("id" text not null, "name" text not null, "slug" text not null, "color" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recipe_difficulty_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_difficulty_name_unique" ON "recipe_difficulty" (name) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_difficulty_slug_unique" ON "recipe_difficulty" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recipe_difficulty_deleted_at" ON "recipe_difficulty" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recipe_resource" ("id" text not null, "title" text not null, "description" text not null default '', "optional" boolean not null default false, "count" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recipe_resource_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recipe_resource_deleted_at" ON "recipe_resource" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_resource_title_unique" ON "recipe_resource" (title) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recipe_step" ("id" text not null, "title" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recipe_step_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recipe_step_deleted_at" ON "recipe_step" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_recipe_step_title_unique" ON "recipe_step" (title) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recipe_step_part" ("id" text not null, "content" text not null, "duration" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recipe_step_part_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recipe_step_part_deleted_at" ON "recipe_step_part" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "recipe" cascade;`);

    this.addSql(`drop table if exists "recipe_category" cascade;`);

    this.addSql(`drop table if exists "recipe_difficulty" cascade;`);

    this.addSql(`drop table if exists "recipe_resource" cascade;`);

    this.addSql(`drop table if exists "recipe_step" cascade;`);

    this.addSql(`drop table if exists "recipe_step_part" cascade;`);
  }

}
