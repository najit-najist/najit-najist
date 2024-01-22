import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { logger } from '@logger';
import {
  ClientResponseError,
  CommonOptions,
  ListResult,
  RecordListOptions,
  RecordOptions,
  pocketbase,
  pocketbaseByCollections,
} from '@najit-najist/pb';
import {
  CreateProduct,
  GetManyProducts,
  Product,
  ProductCategory,
  ProductPrice,
  ProductStock,
  UpdateProduct,
  User,
} from '@schemas';
import { slugifyString } from '@utils';
import {
  PocketbaseFilterItemAsObject,
  createPocketbaseFilters,
} from '@utils/createPocketbaseFilters';
import { insertBetween } from '@utils/insertBetween';
import { objectToFormData } from '@utils/internal';

type GetByType = keyof Pick<Product, 'id' | 'slug'>;
const BASE_EXPAND = `category,${PocketbaseCollections.PRODUCT_STOCK}(product),${PocketbaseCollections.PRODUCT_PRICES}(product)`;

type ProductWithExpand = Omit<Product, 'category' | 'price' | 'stock'> & {
  categories: string[];
  price: string;
  stock: string;
  expand: {
    category: ProductCategory;
    'product_prices(product)': ProductPrice;
    'product_stock(product)'?: ProductStock;
  };
};

export class ProductService {
  private static mapExpandToResponse(base: ProductWithExpand): Product {
    const {
      expand: {
        'product_prices(product)': price,
        'product_stock(product)': stock,
        category,
      },
      ...rest
    } = base;

    return {
      ...rest,
      category,
      price,
      stock,
    };
  }

  static async update(
    id: string,
    { price, stock, name, category, ...input }: UpdateProduct,
    requestOptions?: RecordOptions
  ): Promise<Product> {
    try {
      if (price) {
        const { id: priceId, ...priceUpdatePayload } = price;
        await pocketbase
          .collection(PocketbaseCollections.PRODUCT_PRICES)
          .update(priceId, priceUpdatePayload, requestOptions);
      }

      if (stock) {
        const { id: stockId, ...stockUpdatePayload } = stock;
        await pocketbase
          .collection(PocketbaseCollections.PRODUCT_STOCK)
          .update(stockId, stockUpdatePayload, requestOptions);
      } else if (stock === null) {
        const existingStock = await pocketbaseByCollections.productStocks
          .getFirstListItem(`product="${id}"`, requestOptions)
          .catch((error) => {
            logger.error(
              error,
              'Failed to remove product stock as its probably missign'
            );
            return undefined;
          });

        if (existingStock) {
          await pocketbaseByCollections.productStocks.delete(
            existingStock.id,
            requestOptions
          );
        }
      }

      return this.mapExpandToResponse(
        await pocketbase.collection(PocketbaseCollections.PRODUCTS).update(
          id,
          await objectToFormData({
            ...input,
            ...(name ? { slug: slugifyString(name), name } : null),
            ...(category ? { category: category.id } : null),
          }),
          { ...requestOptions, expand: BASE_EXPAND }
        )
      );
    } catch (error) {
      logger.error(error, 'Failed to update product');

      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Recept pod daným id '${id}' nebyl nalezen`,
          origin: ProductService.name,
        });
      }

      throw error;
    }
  }

  static async create(
    {
      price,
      stock,
      name,
      category,
      ...input
    }: CreateProduct & { createdBy: User['id'] },
    requestOptions?: CommonOptions
  ): Promise<Product> {
    let createdProduct: ProductWithExpand | undefined = undefined;

    try {
      createdProduct = await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .create<ProductWithExpand>(
          await objectToFormData({
            ...input,
            ...(name ? { slug: slugifyString(name), name } : null),
            ...(category ? { category: category.id } : null),
          }),
          { expand: BASE_EXPAND, ...requestOptions }
        );

      const createdProductPrice = await pocketbase
        .collection(PocketbaseCollections.PRODUCT_PRICES)
        .create<ProductPrice>(
          { ...price, product: createdProduct.id },
          requestOptions
        );

      let createdProductStock = undefined;
      if (stock) {
        createdProductStock = await pocketbase
          .collection(PocketbaseCollections.PRODUCT_STOCK)
          .create<ProductStock>(
            { ...stock, product: createdProduct.id },
            requestOptions
          );
      }

      return this.mapExpandToResponse({
        ...createdProduct,
        expand: {
          ...createdProduct.expand,
          'product_prices(product)': createdProductPrice,
          'product_stock(product)': createdProductStock,
        },
      });
    } catch (error) {
      logger.error(
        {
          error,
        },
        'Failed to create product'
      );

      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Produkt nemůže být vytvořen`,
          origin: ProductService.name,
        });
      }

      if (createdProduct) {
        await pocketbase
          .collection(PocketbaseCollections.PRODUCTS)
          .delete(createdProduct.id, requestOptions)
          .catch((removalError) => {
            logger.error(
              {
                removalError,
              },
              'FATAL: Failed to remove created product'
            );
          });
      }

      throw error;
    }
  }

  static async getBy(
    type: GetByType,
    value: any,
    requestOptions?: Omit<RecordListOptions, 'expand'>
  ): Promise<Product> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.PRODUCTS)
          .getFirstListItem<ProductWithExpand>(`${type}="${value}"`, {
            expand: BASE_EXPAND,
            ...requestOptions,
          })
      );
    } catch (error) {
      logger.error({ error, type, value }, 'Failed to get product');

      if (error instanceof ClientResponseError && error.status === 400) {
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Produkt pod daným polem '${type}' nebyl nalezen`,
          origin: ProductService.name,
        });
      }

      throw error;
    }
  }

  static async getMany(
    options?: GetManyProducts & { otherFilters?: string[] },
    requestOpts?: Omit<RecordListOptions, 'expand' | 'filter'>
  ): Promise<ListResult<Product>> {
    const {
      page = 1,
      perPage = 40,
      search,
      categorySlug,
      otherFilters,
    } = options ?? {};

    try {
      const filter = createPocketbaseFilters(
        insertBetween(
          [
            // difficultySlug ? `difficulty.slug = '${difficultySlug}'` : undefined,
            categorySlug &&
              insertBetween(
                categorySlug.map(
                  (slug): PocketbaseFilterItemAsObject => ({
                    leftSide: 'category.slug',
                    rightSide: slug,
                  })
                ),
                '||'
              ),
            ...(otherFilters ?? []),
            search && `(name ~ '${search}' || description ~ '${search}')`,
          ],
          '&&'
        )
      );

      const result = await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .getList<ProductWithExpand>(page, perPage, {
          expand: BASE_EXPAND,
          filter,
          ...requestOpts,
        });

      return { ...result, items: result.items.map(this.mapExpandToResponse) };
    } catch (error) {
      logger.error(error, 'Failed to get many products');

      throw error;
    }
  }
}
