'use client';

import { PencilIcon } from '@heroicons/react/24/solid';
import { useCurrentUser } from '@hooks';
import { recipes } from '@najit-najist/database/models';
import { buttonStyles, Tooltip } from '@najit-najist/ui';
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
    onModel: recipes,
  });

  if (!canEdit) {
    return null;
  }

  return (
    <Tooltip
      trigger={
        <Link
          // @ts-ignore
          href={`/administrace${href}`}
          className={buttonStyles({
            appearance: 'spaceless',
            color: 'blue',
            className: 'h-11 w-11 flex',
          })}
        >
          <PencilIcon className="w-5 h-5 m-auto" />
        </Link>
      }
    >
      Upravit
    </Tooltip>
  );
};
