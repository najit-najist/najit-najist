import { database } from '@najit-najist/database';
import { and, ilike, sql } from '@najit-najist/database/drizzle';
import { productRawMaterials } from '@najit-najist/database/models';
import { productRawMaterialCreateInputSchema } from '@server/schemas/productRawMaterialCreateInputSchema';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

export async function getProductRawMaterials(
  input: z.output<typeof productRawMaterialCreateInputSchema>,
) {
  const cursor = generateCursor({
    primaryCursor: {
      order: 'ASC',
      key: productRawMaterials.id.name,
      schema: productRawMaterials.id,
    },
    cursors: [
      {
        order: 'ASC',
        key: productRawMaterials.name.name,
        schema: productRawMaterials.name,
      },
    ],
  });

  const [items, [{ count }]] = await Promise.all([
    database.query.productRawMaterials.findMany({
      limit: input.perPage,
      where: and(
        cursor.where(input.page),
        input.search
          ? ilike(productRawMaterials.name, `%${input.search}%`)
          : undefined,
      ),
      orderBy: cursor.orderBy,
    }),
    database
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(productRawMaterials),
  ]);

  return {
    items: items,
    nextToken:
      input.perPage === items.length ? cursor.serialize(items.at(-1)) : null,
    total: count,
  };
}
