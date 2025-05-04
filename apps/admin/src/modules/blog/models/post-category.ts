import { model } from '@medusajs/framework/utils';

import { Post } from './post';

export const PostCategory = model.define('post_category', {
  id: model.id().primaryKey(),
  title: model.text().unique(),
  slug: model.text().unique(),
  posts: model.manyToMany(() => Post, {
    mappedBy: 'categories',
  }),
});
