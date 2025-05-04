import { Migration } from '@mikro-orm/migrations';

export class Migration20250525175825 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_brand" drop constraint if exists "product_brand_slug_unique";`);
    this.addSql(`alter table if exists "product_brand" drop constraint if exists "product_brand_name_unique";`);
    this.addSql(`alter table if exists "product_alergen" drop constraint if exists "product_alergen_slug_unique";`);
    this.addSql(`alter table if exists "product_alergen" drop constraint if exists "product_alergen_name_unique";`);
    this.addSql(`create table if not exists "product_alergen" ("id" text not null, "name" text not null, "slug" text not null, "description" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_alergen_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_alergen_name_unique" ON "product_alergen" (name) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_alergen_slug_unique" ON "product_alergen" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_alergen_deleted_at" ON "product_alergen" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_brand" ("id" text not null, "name" text not null, "slug" text not null, "url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_brand_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_brand_name_unique" ON "product_brand" (name) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_brand_slug_unique" ON "product_brand" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_brand_deleted_at" ON "product_brand" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_material" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_material_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_material_deleted_at" ON "product_material" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_alergen" cascade;`);

    this.addSql(`drop table if exists "product_brand" cascade;`);

    this.addSql(`drop table if exists "product_material" cascade;`);
  }

}
