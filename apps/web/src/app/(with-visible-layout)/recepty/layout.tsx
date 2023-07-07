import { NotLoggedInPageContent } from '@components/page-components/NotLoggedInPageContent';
import { getLoggedInUser } from '@najit-najist/api/server';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  try {
    // This throws when user is not logged in
    await getLoggedInUser();

    return <>{children}</>;
  } catch {
    return <NotLoggedInPageContent />;
  }
}
