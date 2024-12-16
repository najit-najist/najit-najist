'use client';

import { buttonStyles } from '@components/common/Button/buttonStyles';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { products } from '@najit-najist/database/models';
import { canUser, UserActions } from '@server/utils/canUser';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { FC } from 'react';

export const EditLink: FC<{ href: LinkProps<RouteType>['href'] }> = ({
  href,
}) => {
  const { data: loggedInUser } = useCurrentUser({
    suspense: true,
    retry: false,
    trpc: {
      ssr: false,
    },
  });

  if (!loggedInUser) {
    return null;
  }

  const canEdit = canUser(loggedInUser, {
    action: UserActions.UPDATE,
    onModel: products,
  });

  if (!canEdit) {
    return null;
  }

  return (
    <Link
      href={href}
      className={buttonStyles({
        appearance: 'solid',
        color: 'yellow',
        className: 'h-11 w-11 flex !px-1',
      })}
    >
      <PencilIcon className="w-5 h-5 m-auto" />
    </Link>
  );
};
