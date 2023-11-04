import { FC } from 'react';

import { NewsletterSubscribe } from '@components/layout';
import { HeroBanner } from './_components/HeroBanner';
import { QuickLinks } from './_components/QuickLinks';
import { VideoSection } from './_components/VideoSection';
import { LatestPosts } from './_components/LatestPosts';

export const revalidate = 0;

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
