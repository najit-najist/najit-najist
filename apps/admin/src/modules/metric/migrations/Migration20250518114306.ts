import { Migration } from '@mikro-orm/migrations';

export class Migration20250518114306 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "metric" ("id" text not null, "name" text not null, "type" text check ("type" in ('size', 'fluid', 'mass')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "metric_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_metric_deleted_at" ON "metric" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_metric_name_type" ON "metric" (name, type) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "metric" cascade;`);
  }

}
