import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { FC } from 'react';

import { buttonStyles } from './Button/buttonStyles';

export const GoBackButton: FC<{ href: string; text: string }> = ({
  href,
  text,
}) => {
  return (
    <Link
      href={href}
      className={buttonStyles({
        appearance: 'link',
        color: 'red',
        class: 'group',
        size: 'sm',
      })}
    >
      <ArrowLeftIcon
        strokeWidth={3}
        className="w-4 h-4 inline-block relative group-active:-translate-x-1.5 group-hover:-translate-x-0.5 mr-1 duration-100 -mt-1"
      />
      {text}
    </Link>
  );
};
