import { model } from '@medusajs/framework/utils';

import { PostCategory } from './post-category';

export const Post = model.define('post', {
  id: model.id().primaryKey(),
  title: model.text().unique().searchable(),
  slug: model.text().unique().searchable(),
  description: model.text().searchable(),
  content: model.text().nullable(),
  publishedAt: model.dateTime().nullable(),
  image: model.text(),

  categories: model.manyToMany(() => PostCategory, {
    mappedBy: 'posts',
    pivotTable: 'post_to_category',
    joinColumn: 'post_id',
    inverseJoinColumn: 'category_id',
  }),
});
