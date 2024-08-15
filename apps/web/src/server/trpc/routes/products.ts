import { ErrorCodes } from '@custom-types';
import { database } from '@najit-najist/database';
import {
  DrizzleError,
  SQL,
  and,
  getTableName,
  ilike,
  inArray,
  isNotNull,
  or,
  sql,
} from '@najit-najist/database/drizzle';
import {
  Product,
  productCategories,
  products,
} from '@najit-najist/database/models';
import { nonEmptyStringSchema, slugSchema } from '@najit-najist/schemas';
import { entityLinkSchema } from '@najit-najist/schemas';
import { ApplicationError, EntityNotFoundError } from '@server/errors';
import { logger } from '@server/logger';
import { productAlergenCreateInputSchema } from '@server/schemas/productAlergenCreateInputSchema';
import { productRawMaterialCreateInputSchema } from '@server/schemas/productRawMaterialCreateInputSchema';
import { UserActions, canUser } from '@server/utils/canUser';
import { getproductAlergens } from '@server/utils/getProductAlergens';
import { getProductRawMaterials } from '@server/utils/getProductRawMaterials';
import { slugifyString } from '@server/utils/slugifyString';
import generateCursor from 'drizzle-cursor';
import { z } from 'zod';

import { defaultGetManySchema } from '../../schemas/base.get-many.schema';
import { productCategoryCreateInputSchema } from '../../schemas/productCategoryCreateInputSchema';
import { t } from '../instance';
import { onlyAdminProcedure } from '../procedures/onlyAdminProcedure';
import { publicProcedure } from '../procedures/publicProcedure';

const baseWith = {
  images: true,
  category: true,
  onlyForDeliveryMethod: true,
  price: true,
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
} as const satisfies NonNullable<
  Parameters<typeof database.query.products.findFirst>['0']
>['with'];

export const getOneProductBy = async <V extends keyof Product>(
  by: V,
  value: Product[V],
) => {
  const item = await database.query.products.findFirst({
    where: (schema, { eq }) => eq(schema[by], value as any),
    with: baseWith,
  });

  if (!item) {
    throw new EntityNotFoundError({
      entityName: getTableName(products),
    });
  }

  return item;
};

const getRoutes = t.router({
  one: publicProcedure
    .input(entityLinkSchema.or(z.object({ slug: nonEmptyStringSchema })))
    .query(async ({ input, ctx }) => {
      const by = 'id' in input ? 'id' : 'slug';
      const loggedInUser = ctx.sessionData?.user;

      try {
        const product = await getOneProductBy(by, (input as any)[by]);

        if (
          !loggedInUser ||
          (!canUser(loggedInUser, {
            action: UserActions.UPDATE,
            onModel: products,
          }) &&
            !product.publishedAt)
        ) {
          throw new EntityNotFoundError({ entityName: getTableName(products) });
        }

        return {
          ...product,
          alergens: product.alergens.map(({ alergen }) => alergen),
        };
      } catch (error) {
        logger.error({ error, input }, 'Failed to get product');

        if (error instanceof EntityNotFoundError) {
          throw new ApplicationError({
            code: ErrorCodes.ENTITY_MISSING,
            message: `Produkt pod daným polem '${Object.keys(
              input,
            )}' nebyl nalezen`,
            origin: 'products',
          });
        }

        throw error;
      }
    }),
  many: publicProcedure
    .input(
      defaultGetManySchema.omit({ page: true }).extend({
        cursor: z.string().optional(),
        categorySlug: z.array(slugSchema).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { search, categorySlug } = input ?? {};
      const conditions: SQL[] = [];
      const loggedInUser = ctx.sessionData?.user;

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
        // cursors: [
        //   {
        //     order: 'DESC',
        //     key: products.createdAt.name,
        //     schema: products.createdAt,
        //   },
        //   {
        //     order: 'ASC',
        //     key: products.publishedAt.name,
        //     schema: products.publishedAt,
        //   },
        // ],
      });

      try {
        const [items, [{ count }]] = await Promise.all([
          database.query.products.findMany({
            where: and(...conditions, cursor.where(input.cursor)),
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
            input.perPage === items.length
              ? cursor.serialize(items.at(-1))
              : null,
          total: count,
        };
      } catch (error) {
        logger.error(error, 'Failed to get many products');

        throw error;
      }
    }),
});

const getCategoriesRoutes = t.router({
  many: t.procedure
    .input(
      defaultGetManySchema
        .omit({ perPage: true })
        .extend({
          perPage: z.number().min(1).default(99).optional(),
          omitEmpty: z.boolean().default(false),
        })
        .default({}),
    )
    .query(async ({ input, ctx }) => {
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
          ),
          orderBy: cursor.orderBy,
          with: {
            products: {
              columns: {
                id: true,
              },
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
          input.perPage === items.length
            ? cursor.serialize(items.at(-1))
            : null,
        total: count,
      };
    }),
});

const categoriesRoutes = t.router({
  get: getCategoriesRoutes,

  create: onlyAdminProcedure
    .input(productCategoryCreateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      try {
        return database
          .insert(productCategories)
          .values({
            name,
            slug: slugifyString(name),
          })
          .returning();
      } catch (error) {
        logger.error(error, 'Failed to create product category');
        if (error instanceof DrizzleError) {
          if (
            error.message.includes('title') ||
            error.message.includes('slug')
          ) {
            throw new ApplicationError({
              code: ErrorCodes.ENTITY_DUPLICATE,
              message: `Název kategorie musí být unikátní`,
              origin: '/products/categories/create',
            });
          }
        }

        logger.error(error, 'Could not create product category');

        throw error;
      }
    }),
});

export const productsRoutes = t.router({
  get: getRoutes,
  categories: categoriesRoutes,
  alergens: t.router({
    get: t.router({
      many: publicProcedure
        .input(productAlergenCreateInputSchema)
        .query(async ({ input }) => {
          return getproductAlergens(input);
        }),
    }),
  }),
  rawMaterials: t.router({
    get: t.router({
      many: publicProcedure
        .input(productRawMaterialCreateInputSchema)
        .query(async ({ input }) => {
          return getProductRawMaterials(input);
        }),
    }),
  }),
});
