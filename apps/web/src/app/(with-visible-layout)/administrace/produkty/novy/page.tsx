import { ProductPageManageContent } from '@components/page-components/ProductPageManageContent';

export const metadata = {
  title: 'Vytvoření produktu',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  return <ProductPageManageContent isEditorHeaderShown viewType={'create'} />;
}
