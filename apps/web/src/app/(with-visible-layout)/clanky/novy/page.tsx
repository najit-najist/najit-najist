import { PostPageManageContent } from '@components/page-components/PostPageManageContent';
import { isUserLoggedIn } from '@najit-najist/api/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Vytvoření článku',
};

export default async function Page() {
  if (!(await isUserLoggedIn())) {
    redirect('/');
  }

  return <PostPageManageContent isEditorHeaderShown viewType={'create'} />;
}
