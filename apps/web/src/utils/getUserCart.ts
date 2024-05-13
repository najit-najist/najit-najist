import { database } from '@najit-najist/database';
import { asc } from '@najit-najist/database/drizzle';
import { orderedProducts, userCarts } from '@najit-najist/database/models';
import { EntityLink } from '@najit-najist/schemas';

export const getUserCart = async (link: EntityLink) => {
  let cart = await database.query.userCarts.findFirst({
    where: (schema, { eq }) => eq(schema.userId, link.id),
    with: {
      products: {
        orderBy: [asc(orderedProducts.createdAt)],
        with: {
          product: {
            with: {
              price: true,
              stock: true,
              images: true,
              category: true,
              onlyForDeliveryMethod: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    const [createdCart] = await database
      .insert(userCarts)
      .values({ userId: link.id })
      .returning();

    cart = {
      ...createdCart,
      products: [],
    };
  }

  let subtotal = 0;

  for (const productInCart of cart.products) {
    const { count, product } = productInCart;

    subtotal += count * (product.price?.value ?? 0);
  }

  // TODO: deselect items from cart if user is not eligible
  return { ...cart, subtotal };
};
