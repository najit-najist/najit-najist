import { Migration } from '@mikro-orm/migrations';

export class Migration20250525175814 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "post_category" drop constraint if exists "post_category_slug_unique";`);
    this.addSql(`alter table if exists "post_category" drop constraint if exists "post_category_title_unique";`);
    this.addSql(`alter table if exists "post" drop constraint if exists "post_slug_unique";`);
    this.addSql(`alter table if exists "post" drop constraint if exists "post_title_unique";`);
    this.addSql(`create table if not exists "post" ("id" text not null, "title" text not null, "slug" text not null, "description" text not null, "content" text null, "publishedAt" timestamptz null, "image" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_post_title_unique" ON "post" (title) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_post_slug_unique" ON "post" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_deleted_at" ON "post" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "post_category" ("id" text not null, "title" text not null, "slug" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_post_category_title_unique" ON "post_category" (title) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_post_category_slug_unique" ON "post_category" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_category_deleted_at" ON "post_category" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "post_to_category" ("post_id" text not null, "category_id" text not null, constraint "post_to_category_pkey" primary key ("post_id", "category_id"));`);

    this.addSql(`alter table if exists "post_to_category" add constraint "post_to_category_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "post_to_category" add constraint "post_to_category_category_id_foreign" foreign key ("category_id") references "post_category" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "post_to_category" drop constraint if exists "post_to_category_post_id_foreign";`);

    this.addSql(`alter table if exists "post_to_category" drop constraint if exists "post_to_category_category_id_foreign";`);

    this.addSql(`drop table if exists "post" cascade;`);

    this.addSql(`drop table if exists "post_category" cascade;`);

    this.addSql(`drop table if exists "post_to_category" cascade;`);
  }

}
