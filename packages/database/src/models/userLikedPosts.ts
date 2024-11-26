import { integer, pgTable } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { posts } from './posts';
import { users } from './users';

export const userLikedPosts = pgTable(
  'user_liked_posts',
  withDefaultFields({
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
  }),
);
