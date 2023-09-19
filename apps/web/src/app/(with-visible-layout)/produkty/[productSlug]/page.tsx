import { ProductPageManageContent } from '@components/page-components/ProductPageManageContent';
import { UserRoles } from '@najit-najist/api';
import { ProductService } from '@najit-najist/api/server';
import { getCachedLoggedInUser } from '@server-utils';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 120;

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
  const isAdmin = loggedInUser?.role === UserRoles.ADMIN;

  if ((!loggedInUser || !isAdmin) && isEditorEnabled) {
    redirect('/');
  }

  const product = await ProductService.getBy('slug', productSlug).catch(() =>
    notFound()
  );

  return (
    <ProductPageManageContent
      isEditorHeaderShown={isAdmin}
      viewType={isEditorEnabled ? 'edit' : 'view'}
      product={product}
    />
  );
}
