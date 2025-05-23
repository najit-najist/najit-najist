import NextImage, { ImageProps } from 'next/image';
import { FC } from 'react';

export const CustomImage: FC<
  Omit<ImageProps, 'alt'> & { onlyImage?: boolean }
> = ({ src, onlyImage, ...rest }) => {
  // Simple check
  const isPreview = src.toString().includes('base64,');

  const image = (
    <NextImage
      width={300}
      height={300}
      src={src}
      alt=""
      unoptimized={isPreview}
      className="absolute top-0 left-0 w-full h-full object-center object-cover rounded-project"
      {...rest}
    />
  );

  if (onlyImage) {
    return image;
  }

  return (
    <div className="relative w-full col-span-2 aspect-square">{image}</div>
  );
};
