import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { ownableModel } from '../internal/ownableModel';
import { fileFieldType } from '../internal/types/file';
import { postCategories } from './postCategories';

export const posts = pgTable('posts', {
  ...modelsBase,
  ...ownableModel,
  title: varchar('title', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  description: text('description').notNull(),
  content: text('content'),
  publishedAt: timestamp('published_at'),
  image: fileFieldType('image'),
});

export const postsToPostCategories = pgTable('posts_to_post_categories', {
  postId: integer('post_id')
    .notNull()
    .references(() => posts.id),
  categoryId: integer('category_id')
    .notNull()
    .references(() => postCategories.id),
});
