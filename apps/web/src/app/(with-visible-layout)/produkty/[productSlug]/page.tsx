import { ProductPageManageContent } from '@components/page-components/ProductPageManageContent';
import { AvailableModels, UserActions, canUser } from '@najit-najist/api';
import { ProductService } from '@najit-najist/api/server';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import { notFound } from 'next/navigation';

export const revalidate = 120;

// TODO
const jsonLd = {
  '@context': 'http://schema.org',
  '@type': 'Product',
  name: 'Delicious Baguette',
  image: [
    'https://example.com/baguette-image1.jpg',
    'https://example.com/baguette-image2.jpg',
  ],
  category: 'Baguettes',
  offers: {
    '@type': 'Offer',
    price: '5.99',
    priceCurrency: 'USD',
  },
  description:
    'A freshly baked baguette with a crispy crust and soft interior. Perfect for any meal or occasion.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: 20,
  },
  reviews: [
    {
      '@type': 'Review',
      author: 'Customer1',
      reviewBody: "Absolutely delicious! The best baguette I've ever had.",
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
    },
    {
      '@type': 'Review',
      author: 'Customer2',
      reviewBody: 'Great texture and flavor. Will buy again.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.5',
      },
    },
  ],
};

type Params = {
  params: { productSlug: string };
  searchParams: { editor?: string };
};

export async function generateMetadata({ params, searchParams }: Params) {
  const { productSlug } = params;
  try {
    const recipe = await ProductService.getBy('slug', productSlug);

    return {
      title: !!searchParams.editor ? `Upravení ${recipe.name}` : recipe.name,
    };
  } catch {
    return {};
  }
}

export default async function Page({ params, searchParams }: Params) {
  const { productSlug } = params;
  const isEditorEnabled = !!searchParams.editor;
  const loggedInUser = await getCachedLoggedInUser();

  const product = await getCachedTrpcCaller()
    .products.get.one({ slug: productSlug })
    .catch(() => notFound());

  return (
    <ProductPageManageContent
      isEditorHeaderShown={
        loggedInUser &&
        canUser(loggedInUser, {
          action: UserActions.UPDATE,
          onModel: AvailableModels.PRODUCTS,
        })
      }
      viewType={isEditorEnabled ? 'edit' : 'view'}
      product={product}
    />
  );
}
