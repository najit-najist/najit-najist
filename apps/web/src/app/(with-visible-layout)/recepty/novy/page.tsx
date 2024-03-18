import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { canUser, UserActions } from '@najit-najist/api';
import { recipes } from '@najit-najist/database/models';
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
      onModel: recipes,
    })
  ) {
    redirect('/');
  }

  return (
    // @ts-ignore
    <RecipePageManageContent isEditorHeaderShown viewType={'create'} />
  );
}
