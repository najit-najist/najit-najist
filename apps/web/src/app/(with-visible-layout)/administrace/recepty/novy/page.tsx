import { RecipePageManageContent } from '@components/page-components/RecipePageManageContent';

export const metadata = {
  title: 'Vytvoření receptu',
};

export default async function Page() {
  return <RecipePageManageContent isEditorHeaderShown viewType={'create'} />;
}
