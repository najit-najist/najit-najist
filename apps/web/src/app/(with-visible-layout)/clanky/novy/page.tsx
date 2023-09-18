import { PostPageManageContent } from '@components/page-components/PostPageManageContent';

export const metadata = {
  title: 'Vytvoření článku',
};

export default async function Page() {
  return <PostPageManageContent isEditorHeaderShown viewType={'create'} />;
}
