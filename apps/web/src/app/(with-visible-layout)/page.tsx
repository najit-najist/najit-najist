import { LatestProducts } from '@app-components/LatestProducts';
import { NewsletterSubscribe } from '@components/layout';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { FC } from 'react';

import { HeroBanner } from './_components/HeroBanner';
import { LatestPosts } from './_components/LatestPosts';
import { QuickLinks } from './_components/QuickLinks';
import { VideoSection } from './_components/VideoSection';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const MainPage: FC = async () => {
  const loggedInUser = await getCachedLoggedInUser();

  return (
    <>
      <HeroBanner />
      <QuickLinks />
      <LatestProducts />
      <LatestPosts />
      <VideoSection />
      <div className="mt-28" />
      <NewsletterSubscribe
        user={
          loggedInUser?.newsletter
            ? { newsletter: loggedInUser?.newsletter }
            : undefined
        }
      />
    </>
  );
};

export default MainPage;
