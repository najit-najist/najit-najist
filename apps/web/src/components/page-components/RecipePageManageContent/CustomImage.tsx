import { FC } from 'react';
import NextImage from 'next/image';
import { Badge } from '@najit-najist/ui';

export const CustomImage: FC<{ src: string }> = ({ src }) => {
  // Simple check
  const isPreview = src.includes('base64,');

  return (
    <div className="relative w-full col-span-2 aspect-square">
      <NextImage
        width={300}
        height={300}
        src={src}
        alt=""
        unoptimized={isPreview}
        className="absolute top-0 left-0 w-full h-full object-center object-cover rounded-md"
      />
      <div className="absolute top-0 right-0 m-2">
        {isPreview ? <Badge color="green">Nový</Badge> : null}
      </div>
    </div>
  );
};
