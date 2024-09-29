import { database } from '@najit-najist/database';
import {
  and,
  ilike,
  inArray,
  isNotNull,
  or,
  sql,
  SQL,
} from '@najit-najist/database/drizzle';
import {
  productCategories,
  productPrices,
  products,
  User,
} from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { getProductsInputSchema } from '@server/schemas/getProductsInputSchema';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

import { canUser, UserActions } from './canUser';

export async function getProducts(
  input: z.output<typeof getProductsInputSchema>,
  { loggedInUser }: { loggedInUser?: User } = {},
) {
  const { search, categorySlug } = input ?? {};
  const conditions: SQL[] = [];

  if (categorySlug?.length) {
    const categories = await database.query.productCategories.findMany({
      where: inArray(productCategories.slug, categorySlug),
    });

    conditions.push(
      inArray(
        products.categoryId,
        categories.map(({ id }) => id),
      ),
    );
  }

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.description, `%${search}%`),
      )!,
    );
  }

  if (
    !loggedInUser ||
    !canUser(loggedInUser, {
      action: UserActions.UPDATE,
      onModel: products,
    })
  ) {
    conditions.push(isNotNull(products.publishedAt));
  }

  const cursor = generateCursor({
    primaryCursor: {
      order: 'ASC',
      key: products.id.name,
      schema: products.id,
    },
    cursors: [
      {
        order: 'ASC',
        key: products.name.name,
        schema: products.name,
      },
    ],
  });

  try {
    const [items, [{ count }]] = await Promise.all([
      database.query.products.findMany({
        where: and(...conditions, cursor.where(input.cursor)),
        // orderBy: sql`${productPrices.value} desc nulls first`,
        orderBy: cursor.orderBy,
        limit: input.perPage,
        with: {
          category: true,
          images: true,
          onlyForDeliveryMethod: true,
          price: true,
          stock: true,
        },
      }),
      database
        .select({
          count: sql`count(*)`.mapWith(Number).as('count'),
        })
        .from(products)
        .where(and(...conditions)),
    ]);

    return {
      items,
      nextCursor:
        input.perPage === items.length ? cursor.serialize(items.at(-1)) : null,
      total: count,
    };
  } catch (error) {
    logger.error(error, 'Failed to get many products');

    throw error;
  }
}
