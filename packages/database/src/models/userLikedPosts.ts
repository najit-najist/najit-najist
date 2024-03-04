import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { posts } from './posts';
import { users } from './users';

export const userLikedPosts = pgTable('user_liked_posts', {
  ...modelsBase,
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  postId: integer('post_id')
    .references(() => posts.id)
    .notNull(),
});
