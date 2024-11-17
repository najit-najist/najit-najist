import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { recipes } from '@najit-najist/database/models';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import { notFound } from 'next/navigation';

export const revalidate = 120;

type Params = {
  params: Promise<{ receptSlug: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { receptSlug } = await params;
  const trpc = await getCachedTrpcCaller();

  try {
    const recipe = await trpc.recipes.getOne({ slug: receptSlug });

    return {
      title: recipe.title,
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: Params) {
  const { receptSlug } = await params;
  const loggedInUser = await getCachedLoggedInUser();
  const trpc = await getCachedTrpcCaller();

  const recipe = await trpc.recipes
    .getOne({ slug: receptSlug })
    .catch(() => notFound());

  return (
    <RecipePageManageContent
      isEditorHeaderShown={
        loggedInUser &&
        canUser(loggedInUser, {
          action: UserActions.UPDATE,
          onModel: recipes,
        })
      }
      viewType={'view'}
      recipe={recipe}
    />
  );
}
