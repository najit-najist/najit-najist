import { database } from '@najit-najist/database';
import { and, ilike, sql } from '@najit-najist/database/drizzle';
import { productAlergens } from '@najit-najist/database/models';
import { productAlergenCreateInputSchema } from '@server/schemas/productAlergenCreateInputSchema';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

export async function getproductAlergens(
  input: z.output<typeof productAlergenCreateInputSchema>,
) {
  const cursor = generateCursor({
    primaryCursor: {
      order: 'ASC',
      key: productAlergens.id.name,
      schema: productAlergens.id,
    },
    cursors: [
      {
        order: 'ASC',
        key: productAlergens.name.name,
        schema: productAlergens.name,
      },
    ],
  });

  const [items, [{ count }]] = await Promise.all([
    database.query.productAlergens.findMany({
      limit: input.perPage,
      where: and(
        cursor.where(input.page),
        input.search
          ? ilike(productAlergens.name, `%${input.search}%`)
          : undefined,
      ),
      orderBy: cursor.orderBy,
    }),
    database
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(productAlergens),
  ]);

  return {
    items: items,
    nextToken:
      input.perPage === items.length ? cursor.serialize(items.at(-1)) : null,
    total: count,
  };
}
