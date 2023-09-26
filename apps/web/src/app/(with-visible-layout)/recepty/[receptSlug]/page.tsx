import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { AvailableModels, canUser, UserActions } from '@najit-najist/api';
import { RecipesService } from '@najit-najist/api/server';
import { getCachedLoggedInUser } from '@server-utils';
import { notFound } from 'next/navigation';

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

  const recipe = await RecipesService.getBy('slug', receptSlug).catch(() =>
    notFound()
  );

  return (
    <RecipePageManageContent
      isEditorHeaderShown={
        loggedInUser &&
        canUser(loggedInUser, {
          action: UserActions.UPDATE,
          onModel: AvailableModels.RECIPES,
        })
      }
      viewType={isEditorEnabled ? 'edit' : 'view'}
      recipe={recipe}
    />
  );
}
