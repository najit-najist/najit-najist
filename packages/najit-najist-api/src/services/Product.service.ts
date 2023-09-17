import { ErrorCodes, PocketbaseCollections } from '@custom-types';
import { ApplicationError } from '@errors';
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
import { slugify } from '@utils';
import { objectToFormData } from '@utils/internal';

type GetByType = keyof Pick<Product, 'id'>;
const BASE_EXPAND = `categories,${PocketbaseCollections.PRODUCT_STOCK}(product).stock,${PocketbaseCollections.PRODUCT_PRICES}(product).price`;

type ProductWithExpand = Omit<Product, 'categories' | 'price' | 'stock'> & {
  categories: string[];
  price: string;
  stock: string;
  expand: {
    categories: ProductCategory[];
    price: ProductPrice;
    stock: ProductStock;
  };
};

export class ProductService {
  private static mapExpandToResponse(base: ProductWithExpand): Product {
    const {
      expand: { categories, price, stock },
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
            ...(name ? { slug: slugify(name), name } : null),
          }),
          { expand: BASE_EXPAND }
        )
      );
    } catch (error) {
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
    try {
      const result = await pocketbase
        .collection(PocketbaseCollections.PRODUCTS)
        .create<ProductWithExpand>(
          await objectToFormData({
            ...input,
            ...(name ? { slug: slugify(name), name } : null),
          }),
          { expand: BASE_EXPAND }
        );

      const productPrice = await pocketbase
        .collection(PocketbaseCollections.PRODUCT_PRICES)
        .create<ProductPrice>({ ...price, product: result.id });

      const productStock = await pocketbase
        .collection(PocketbaseCollections.PRODUCT_STOCK)
        .create<ProductStock>({ ...stock, product: result.id });

      return this.mapExpandToResponse({
        ...result,
        expand: {
          price: productPrice,
          stock: productStock,
          categories: [],
        },
      });
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 400) {
        console.log({ e: error.data.data });
        throw new ApplicationError({
          code: ErrorCodes.ENTITY_MISSING,
          message: `Recept nemůže být vytvořen`,
          origin: ProductService.name,
        });
      }

      throw error;
    }
  }

  static async getBy(type: GetByType, value: any): Promise<Product> {
    try {
      return this.mapExpandToResponse(
        await pocketbase
          .collection(PocketbaseCollections.RECIPES)
          .getFirstListItem<ProductWithExpand>(`${type}="${value}"`, {
            expand: BASE_EXPAND,
          })
      );
    } catch (error) {
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
      throw error;
    }
  }
}
