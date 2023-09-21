import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
import { logger } from '@logger';
import { ClientResponseError, ListResult, pocketbase } from '@najit-najist/pb';
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
import { objectToFormData } from '@utils/internal';

type GetByType = keyof Pick<Product, 'id' | 'slug'>;
const BASE_EXPAND = `categories,${PocketbaseCollections.PRODUCT_STOCK}(product),${PocketbaseCollections.PRODUCT_PRICES}(product)`;

type ProductWithExpand = Omit<Product, 'categories' | 'price' | 'stock'> & {
  categories: string[];
  price: string;
  stock: string;
  expand: {
    categories: ProductCategory[];
    'product_prices(product)': ProductPrice;
    'product_stock(product)': ProductStock;
  };
};

export class ProductService {
  private static mapExpandToResponse(base: ProductWithExpand): Product {
    const {
      expand: {
        'product_prices(product)': price,
        'product_stock(product)': stock,
        categories,
      },
      ...rest
    } = base;

    return {
      ...rest,
      categories,
      price,
      stock,
    };
  }

  static async update(
    id: string,
    { price, stock, name, ...input }: UpdateProduct
  ): Promise<Product> {
    try {
      if (price) {
        const { id: priceId, ...priceUpdatePayload } = price;
        await pocketbase
          .collection(PocketbaseCollections.PRODUCT_PRICES)
          .update(priceId, priceUpdatePayload);
      }

      if (stock) {
        const { id: stockId, ...stockUpdatePayload } = stock;
        await pocketbase
          .collection(PocketbaseCollections.PRODUCT_STOCK)
          .update(stockId, stockUpdatePayload);
      }

      return this.mapExpandToResponse(
        await pocketbase.collection(PocketbaseCollections.PRODUCTS).update(
          id,
          await objectToFormData({
            ...input,
            ...(name ? { slug: slugifyString(name), name } : null),
          }),
          { expand: BASE_EXPAND }
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

  static async create({
    price,
    stock,
    name,
    ...input
  }: CreateProduct & { createdBy: User['id'] }): Promise<Product> {
    let createdProduct: ProductWithExpand | undefined = undefined;

    try {
      createdProduct = await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .create<ProductWithExpand>(
          await objectToFormData({
            ...input,
            ...(name ? { slug: slugifyString(name), name } : null),
          }),
          { expand: BASE_EXPAND }
        );

      const createdProductPrice = await pocketbase
        .collection(PocketbaseCollections.PRODUCT_PRICES)
        .create<ProductPrice>({ ...price, product: createdProduct.id });

      const createdProductStock = await pocketbase
        .collection(PocketbaseCollections.PRODUCT_STOCK)
        .create<ProductStock>({ ...stock, product: createdProduct.id });

      return this.mapExpandToResponse({
        ...createdProduct,
        expand: {
          'product_prices(product)': createdProductPrice,
          'product_stock(product)': createdProductStock,
          categories: [],
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
        pocketbase
          .collection(PocketbaseCollections.PRODUCTS)
          .delete(createdProduct.id)
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

  static async getBy(type: GetByType, value: any): Promise<Product> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.PRODUCTS)
          .getFirstListItem<ProductWithExpand>(
            `${type}="${decodeURIComponent(value)}"`,
            {
              expand: BASE_EXPAND,
            }
          )
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
    options?: GetManyProducts
  ): Promise<ListResult<Product>> {
    const { page = 1, perPage = 40, search } = options ?? {};

    try {
      const filter = [
        // difficultySlug ? `difficulty.slug = '${difficultySlug}'` : undefined,
        // typeSlug ? `type.slug = '${typeSlug}'` : undefined,
        search
          ? `(name ~ '${search}' || description ~ '${search}')`
          : undefined,
      ]
        .filter(Boolean)
        .join(' && ');

      const result = await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .getList<ProductWithExpand>(page, perPage, {
          expand: BASE_EXPAND,
          filter,
        });

      return { ...result, items: result.items.map(this.mapExpandToResponse) };
    } catch (error) {
      logger.error(error, 'Failed to get many products');

      throw error;
    }
  }
}
