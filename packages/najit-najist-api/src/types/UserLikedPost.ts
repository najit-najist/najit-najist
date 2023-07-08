import { EntryType } from '@schemas';
import { Post } from './Post';
import { User } from './User';

export type UserLikedPost = EntryType & {
  likedBy: User['id'];
  likedItem: Post['id'];
};
