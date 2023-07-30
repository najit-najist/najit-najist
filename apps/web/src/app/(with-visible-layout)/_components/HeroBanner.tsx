import Image from 'next/image';
import { FC } from 'react';

import heroBannerImage from '/public/images/pages/main-page/hero-banner-picture.png';

export const HeroBanner: FC = () => {
  return (
    <div className="relative overflow-hidden -mt-40">
      <Image
        src={heroBannerImage}
        alt="úvodní obrázek najít najíst"
        className="absolute left-0 top-0 w-full h-full object-cover object-center"
      />
      <div className="h-40" />
      <div className="container relative pb-40 sm:pb-52 pt-10 sm:pt-24">
        <h2 className="font-suez text-4xl sm:text-6xl leading-relaxed max-w-[54rem] sm:leading-relaxed text-deep-green-300">
          Pomůžeme Vám Najít cestu k prostřenému stolu, kde se můžete Najíst
          téměř jako dřív...
        </h2>
      </div>
    </div>
  );
};
