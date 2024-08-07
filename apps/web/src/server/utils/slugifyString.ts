import { default as slugifyBase } from 'slugify';

export const slugifyString = (input: string) =>
  slugifyBase(input, {
    locale: 'cs',
    remove: /[*+~.,()%'"!:@]/g,
  }).toLowerCase();
