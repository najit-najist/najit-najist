import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { AvailableModels, canUser, UserActions } from '@najit-najist/api';
import { getLoggedInUser } from '@najit-najist/api/server';
import { getCachedLoggedInUser } from '@server-utils';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Vytvoření receptu',
};

export const revalidate = 30;

export default async function Page() {
  const loggedInUser = await getCachedLoggedInUser();
  if (
    !loggedInUser ||
    !canUser(loggedInUser, {
      action: UserActions.CREATE,
      onModel: AvailableModels.RECIPES,
    })
  ) {
    redirect('/');
  }

  return (
    // @ts-ignore
    <RecipePageManageContent isEditorHeaderShown viewType={'create'} />
  );
}
