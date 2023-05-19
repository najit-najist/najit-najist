import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';
import { isUserLoggedIn, RecipesService } from '@najit-najist/api/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Vytvoření receptu',
};

export default async function Page() {
  if (!(await isUserLoggedIn())) {
    redirect('/');
  }

  const { items: metrics } = await RecipesService.resourceMetrics.getMany({
    page: 1,
    perPage: 999,
  });

  return (
    <RecipePageManageContent
      isEditorHeaderShown
      viewType={'create'}
      metrics={metrics}
    />
  );
}
