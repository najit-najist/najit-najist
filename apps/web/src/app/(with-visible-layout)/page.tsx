import { NewsletterSubscribe } from '@components/layout';
import { FC } from 'react';

import { HeroBanner } from './_components/HeroBanner';
import { LatestPosts } from './_components/LatestPosts';
import { QuickLinks } from './_components/QuickLinks';
import { VideoSection } from './_components/VideoSection';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const MainPage: FC = () => {
  return (
    <>
      <HeroBanner />
      <QuickLinks />
      <VideoSection />
      <LatestPosts />
      <div className="mt-28" />
      <NewsletterSubscribe />
    </>
  );
};

export default MainPage;
