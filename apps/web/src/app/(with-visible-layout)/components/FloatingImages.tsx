import Image from 'next/image';
import { FC } from 'react';

import breadUrl from '/public/images/pages/main-page/bread.webp';
import cheeseUrl from '/public/images/pages/main-page/cheese.webp';
import cupcakeUrl from '/public/images/pages/main-page/cupcake.webp';
import milkUrl from '/public/images/pages/main-page/milk.webp';

export const FloatingImages: FC = () => {
  return (
    <>
      <Image
        className="absolute -translate-x-[80%] -translate-y-[120%] left-0 top-0"
        alt=""
        width={312}
        height={221}
        src={cheeseUrl}
      />
      <Image
        className="absolute translate-x-[80%] -translate-y-[80%] sm:block hidden rotate-45 right-0 top-0"
        alt=""
        width={367}
        height={322}
        src={cupcakeUrl}
      />
      <Image
        className="absolute -translate-x-[80%] translate-y-[100%] sm:block hidden bottom-0 left-0"
        alt=""
        width={368}
        height={260}
        src={breadUrl}
      />
      <Image
        className="absolute translate-x-[80%] translate-y-[100%] bottom-0 right-0"
        alt=""
        width={357}
        height={252}
        src={milkUrl}
      />
    </>
  );
};
