import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

import logoImage from '../../../public/logo.webp';

export interface LogoProps extends Omit<ImageProps, 'src' | 'alt'> {}

export const Logo: FC<LogoProps> = ({ ...props }) => {
  return <Image src={logoImage} alt="Logo najitnajist.cz" {...props} />;
};
