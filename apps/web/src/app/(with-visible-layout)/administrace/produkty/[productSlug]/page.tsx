import { ProductPageManageContent } from '@components/page-components/ProductPageManageContent';
import { logger } from '@logger/server';
import { products } from '@najit-najist/database/models';
import { UserActions, canUser } from '@server/utils/canUser';
import { getProduct } from '@server/utils/getProduct';
import { getLoggedInUser } from '@server/utils/server';
import { notFound } from 'next/navigation';

export const revalidate = 0;

type Params = {
  params: Promise<{ productSlug: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { productSlug } = await params;
  const decodedSlug = decodeURIComponent(productSlug);
  const loggedInUser = await getLoggedInUser();

  const product = await getProduct(
    {
      slug: decodedSlug,
    },
    { loggedInUser },
  );

  if (!product) {
    return {
      title: 'Nenalezeno',
    };
  }

  return {
    title: `Upravení ${product.name}`,
  };
}

export default async function Page({ params }: Params) {
  const { productSlug } = await params;
  const loggedInUser = await getLoggedInUser();
  const decodedSlug = decodeURIComponent(productSlug);

  const product = await getProduct(
    {
      slug: decodedSlug,
    },
    { loggedInUser },
  );

  if (!product) {
    logger.error('[PRODUCTS] Could not find product to administrate', {
      productSlug,
      loggedInUser: loggedInUser.email,
    });
    notFound();
  }

  return (
    <ProductPageManageContent
      isEditorHeaderShown={
        loggedInUser &&
        canUser(loggedInUser, {
          action: UserActions.UPDATE,
          onModel: products,
        })
      }
      viewType={'edit'}
      product={product}
    />
  );
}
