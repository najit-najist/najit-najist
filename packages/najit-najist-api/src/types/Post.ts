import { ContentTypeBase } from './ContentTypeBase';
import { PostCategories } from './PostCategories';

export type Post = ContentTypeBase & {
  title: string;
  image: string;
  slug: string;
  description: string;
  /**
   * Indicates that post is created and when
   */
  publishedAt: string;
  content: string;
  categories: Omit<PostCategories, 'created' | 'updated'>[];
};
