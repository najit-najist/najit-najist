import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { isUserLoggedIn, RecipesService } from '@najit-najist/api/server';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 120;

type Params = {
  params: { receptSlug: string };
  searchParams: { editor?: string };
};

const service = new RecipesService();

export async function generateMetadata({ params, searchParams }: Params) {
  const { receptSlug } = params;
  try {
    const recipe = await service.getBy('slug', receptSlug);

    return {
      title: !!searchParams.editor ? `Upravení ${recipe.title}` : recipe.title,
    };
  } catch {
    return {};
  }
}

export default async function Page({ params, searchParams }: Params) {
  const { receptSlug } = params;
  const isEditorEnabled = !!searchParams.editor;
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn && isEditorEnabled) {
    redirect('/');
  }

  const recipe = await service
    .getBy('slug', receptSlug)
    .catch(() => notFound());

  return (
    // @ts-ignore
    <RecipePageManageContent
      isEditorHeaderShown={isLoggedIn}
      viewType={isEditorEnabled ? 'edit' : 'view'}
      recipe={recipe}
    />
  );
}
