import Image from 'next/image';
import { FC } from 'react';

import heroBannerImage from '../../../public/images/pages/main-page/hero-banner-picture.png';

export const HeroBanner: FC = () => {
  return (
    <div className="relative overflow-hidden -mt-40">
      <Image
        src={heroBannerImage}
        alt="úvodní obrázek najít najíst"
        className="absolute left-0 top-0 w-full h-full object-cover object-center"
      />
      <div className="h-40" />
      <div className="container relative pb-52 pt-24">
        <h2 className="font-suez text-6xl max-w-[52rem] leading-relaxed text-deep-green-300">
          U nás můžete NAJÍT řešení jak jíst bez lepku a laktózy a konečně se
          NAJÍST téměř jako dřív...
        </h2>
      </div>
    </div>
  );
};
