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
  publishedAt?: string | null;
  content?: {
    /**
     * Editor's version
     */
    version?: string;

    /**
     * Timestamp of saving in milliseconds
     */
    time?: number;

    /**
     * Saved Blocks
     */
    blocks: any[];
  };
  categories: Omit<PostCategories, 'created' | 'updated'>[];
};
