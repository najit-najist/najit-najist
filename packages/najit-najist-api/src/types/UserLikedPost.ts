import { EntryType, User } from '@schemas';
import { Post } from './Post';

export type UserLikedPost = EntryType & {
  likedBy: User['id'];
  likedItem: Post['id'];
};
