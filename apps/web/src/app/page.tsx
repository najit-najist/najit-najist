import { FC } from 'react';

import { NewsletterSubscribe } from '@components/layout';
import { HeroBanner } from './components/HeroBanner';
import { QuickLinks } from './components/QuickLinks';

const MainPage: FC = () => {
  return (
    <>
      <HeroBanner />
      <QuickLinks />
      <NewsletterSubscribe />
    </>
  );
};

export default MainPage;
