import { EntryType, Recipe, User } from '@schemas';

export type UserLikedRecipe = EntryType & {
  likedBy: User['id'];
  likedItem: Recipe['id'];
};
