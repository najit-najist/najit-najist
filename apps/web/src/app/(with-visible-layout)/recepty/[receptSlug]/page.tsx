import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { AvailableModels, canUser, UserActions } from '@najit-najist/api';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import { notFound } from 'next/navigation';

export const revalidate = 120;

type Params = {
  params: { receptSlug: string };
  searchParams: { editor?: string };
};

export async function generateMetadata({ params, searchParams }: Params) {
  const { receptSlug } = params;
  const trpc = getCachedTrpcCaller();

  try {
    const recipe = await trpc.recipes.getOne({ where: { slug: receptSlug } });

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
  const trpc = getCachedTrpcCaller();

  const recipe = await trpc.recipes
    .getOne({ where: { slug: receptSlug } })
    .catch(() => notFound());

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
