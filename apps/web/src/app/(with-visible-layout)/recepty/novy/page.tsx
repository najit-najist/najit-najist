import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { recipes } from '@najit-najist/database/models';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
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
