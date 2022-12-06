import { FC } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { QuickLinks } from './components/QuickLinks';

const MainPage: FC = () => {
  return (
    <>
      <HeroBanner />
      <QuickLinks />
    </>
  );
};

export default MainPage;
