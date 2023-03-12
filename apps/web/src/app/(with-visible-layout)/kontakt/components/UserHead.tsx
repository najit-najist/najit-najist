import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

export type imagePosition = 'center' | 'top';

export const UserHead: FC<{
  image: StaticImageData;
  name: string;
  position: string;
  imagePosition?: imagePosition;
}> = ({ image, name, position, imagePosition = 'top' }) => {
  return (
    <div className="text-center">
      <div className="w-[225px] h-[225px] rounded-full shadow-md overflow-hidden relative">
        <Image
          alt=""
          src={image}
          placeholder="blur"
          fill
          quality={100}
          className={clsx(
            'absolute top-0 left-0 object-cover',
            imagePosition === 'top' ? 'object-top' : 'object-center'
          )}
        />
      </div>
      <h3 className="text-xl mt-4">{name}</h3>
      <p>{position}</p>
    </div>
  );
};
