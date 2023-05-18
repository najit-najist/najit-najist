import { FC } from 'react';
import NextImage from 'next/image';

export const CustomImage: FC<{ src: string }> = ({ src }) => (
  <div className="relative w-full col-span-2 aspect-square">
    <NextImage
      width={300}
      height={300}
      src={src}
      alt=""
      className="absolute top-0 left-0 w-full h-full object-center object-cover rounded-md"
    />
  </div>
);
