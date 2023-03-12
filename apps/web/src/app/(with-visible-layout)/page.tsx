import { FC } from 'react';

import { NewsletterSubscribe } from '@components/layout';
import { HeroBanner } from './components/HeroBanner';
import { QuickLinks } from './components/QuickLinks';
import { VideoSection } from './components/VideoSection';

const MainPage: FC = () => {
  return (
    <>
      <HeroBanner />
      <QuickLinks />
      <VideoSection />
      <div className="mt-28" />
      <NewsletterSubscribe />
    </>
  );
};

export default MainPage;
