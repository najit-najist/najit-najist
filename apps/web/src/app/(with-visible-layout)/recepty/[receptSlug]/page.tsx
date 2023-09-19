import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { UserRoles } from '@najit-najist/api';
import { getLoggedInUser, RecipesService } from '@najit-najist/api/server';
import { getCachedLoggedInUser } from '@server-utils';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 120;

type Params = {
  params: { receptSlug: string };
  searchParams: { editor?: string };
};

export async function generateMetadata({ params, searchParams }: Params) {
  const { receptSlug } = params;
  try {
    const recipe = await RecipesService.getBy('slug', receptSlug);

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
  const loggedInUser = await getCachedLoggedInUser();
  const isAdmin = loggedInUser?.role === UserRoles.ADMIN;

  if ((!loggedInUser || !isAdmin) && isEditorEnabled) {
    redirect('/');
  }

  const recipe = await RecipesService.getBy('slug', receptSlug).catch(() =>
    notFound()
  );

  return (
    // @ts-ignore
    <RecipePageManageContent
      isEditorHeaderShown={isAdmin}
      viewType={isEditorEnabled ? 'edit' : 'view'}
      recipe={recipe}
    />
  );
}
