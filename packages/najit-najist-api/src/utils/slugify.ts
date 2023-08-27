import { default as slugifyBase } from 'slugify';

export const slugify = (input: string) =>
  slugifyBase(input, { locale: 'cs' }).toLowerCase();
