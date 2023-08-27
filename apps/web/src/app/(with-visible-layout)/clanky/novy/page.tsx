import { PostPageManageContent } from '@components/page-components/PostPageManageContent';
import { AvailableModels, canUser, UserActions } from '@najit-najist/api';
import { getLoggedInUser, isUserLoggedIn } from '@najit-najist/api/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Vytvoření článku',
};

export default async function Page() {
  const loggedInUser = await getLoggedInUser().catch(() => undefined);
  if (
    !loggedInUser ||
    !canUser(loggedInUser, {
      action: UserActions.CREATE,
      onModel: AvailableModels.POST,
    })
  ) {
    redirect('/');
  }

  return <PostPageManageContent isEditorHeaderShown viewType={'create'} />;
}
