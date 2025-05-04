import { MedusaService } from '@medusajs/framework/utils';

import { Post } from './models/post';
import { PostCategory } from './models/post-category';

export class BlogModuleService extends MedusaService({
  Post,
  PostCategory,
}) {}
