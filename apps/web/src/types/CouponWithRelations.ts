import {
  Coupon,
  CouponPatch,
  Product,
  ProductCategory,
} from '@najit-najist/database/models';

import type { ProductWithRelationsLocal } from '.';

export type CouponWithRelations = Coupon & {
  patches: CouponPatch[];
  onlyForProductCategories: {
    id: number;
    categoryId: ProductCategory['id'];
    category: ProductCategory;
  }[];
  onlyForProducts: {
    id: number;
    productId: Product['id'];
    product: Product & {
      category: ProductCategory | null;
      images: ProductWithRelationsLocal['images'];
    };
  }[];
};
