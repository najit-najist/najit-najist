import { database } from '@najit-najist/database';
import { and, ilike, inArray, sql } from '@najit-najist/database/drizzle';
import { productCategories } from '@najit-najist/database/models';
import { getProductCategoriesInputSchema } from '@server/schemas/getProductCategoriesInputSchema';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

export async function getProductCategories(
  input: z.output<typeof getProductCategoriesInputSchema> & {
    filter?: { slug?: string[] };
  },
) {
  const cursor = generateCursor({
    primaryCursor: {
      order: 'ASC',
      key: productCategories.id.name,
      schema: productCategories.id,
    },
    cursors: [
      {
        order: 'ASC',
        key: productCategories.name.name,
        schema: productCategories.name,
      },
    ],
  });

  const [items, [{ count }]] = await Promise.all([
    database.query.productCategories.findMany({
      limit: input.perPage,
      where: and(
        cursor.where(input.page),
        input.search
          ? ilike(productCategories.name, `%${input.search}%`)
          : undefined,
        input.filter?.slug
          ? inArray(productCategories.slug, input.filter.slug)
          : undefined,
      ),
      orderBy: cursor.orderBy,
      with: {
        products: {
          columns: {
            id: true,
          },
          ...(input.omitEmpty && {
            where: (schema, { isNotNull }) => isNotNull(schema.publishedAt),
          }),
        },
      },
    }),
    database
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(productCategories),
  ]);

  return {
    items: input.omitEmpty
      ? items
          .filter(({ products }) => products.length)
          .map(({ products, ...rest }) => rest)
      : items,
    nextToken:
      input.perPage === items.length ? cursor.serialize(items.at(-1)) : null,
    total: count,
  };
}
