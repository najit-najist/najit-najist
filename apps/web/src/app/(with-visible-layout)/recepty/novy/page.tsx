import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { isUserLoggedIn } from '@najit-najist/api/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Vytvoření receptu',
};

export const revalidate = 30;

export default async function Page() {
  if (!(await isUserLoggedIn())) {
    redirect('/');
  }

  return (
    // @ts-ignore
    <RecipePageManageContent isEditorHeaderShown viewType={'create'} />
  );
}
