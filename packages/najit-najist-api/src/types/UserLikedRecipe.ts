import { EntryType, Recipe } from '@schemas';
import { User } from './User';

export type UserLikedRecipe = EntryType & {
  likedBy: User['id'];
  likedItem: Recipe['id'];
};
