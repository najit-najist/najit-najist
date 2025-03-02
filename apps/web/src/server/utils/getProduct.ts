import { database } from '@najit-najist/database';
import { products, User } from '@najit-najist/database/models';
import { entityLinkSchema, nonEmptyStringSchema } from '@najit-najist/schemas';
import { z } from 'zod';

import { canUser, UserActions } from './canUser';

const inputSchema = entityLinkSchema.or(
  z.object({ slug: nonEmptyStringSchema }),
);

export async function getProduct(
  input: z.input<typeof inputSchema>,
  { loggedInUser }: { loggedInUser?: User } = {},
) {
  const by = ('id' in input ? 'id' : 'slug') as keyof typeof input;
  const canUserViewUnpublished =
    loggedInUser &&
    canUser(loggedInUser, {
      action: UserActions.UPDATE,
      onModel: products,
    });

  const product = await database.query.products.findFirst({
    where: (schema, { eq, and, isNotNull }) =>
      and(
        eq(schema[by], input[by]),
        canUserViewUnpublished ? undefined : isNotNull(schema.publishedAt),
      ),
    with: {
      images: {
        orderBy: (schema, { asc }) => asc(schema.createdAt),
      },
      category: true,
      stock: true,
      composedOf: {
        with: {
          rawMaterial: true,
        },
        orderBy: (schema, { asc }) => asc(schema.order),
      },
      alergens: {
        with: {
          alergen: true,
        },
        // orderBy: (schema, {asc}) => asc(schema.)
      },
      limitedToDeliveryMethods: {
        with: {
          deliveryMethod: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    alergens: product.alergens.map(({ alergen }) => alergen),
  };
}
