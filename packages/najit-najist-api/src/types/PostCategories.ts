import { ContentTypeBase } from './ContentTypeBase';

export type PostCategories = ContentTypeBase & {
  title: string;
  slug: string;
};
