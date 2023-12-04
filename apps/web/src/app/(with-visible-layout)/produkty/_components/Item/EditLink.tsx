'use client';

import { PencilIcon } from '@heroicons/react/24/solid';
import { useCurrentUser } from '@hooks';
import { AvailableModels, canUser, UserActions } from '@najit-najist/api';
import { buttonStyles, Tooltip } from '@najit-najist/ui';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link, { LinkProps } from 'next/link';
import { FC } from 'react';

export const EditLink: FC<{ href: LinkProps<RouteType>['href'] }> = ({
  href,
}) => {
  const { data: loggedInUser } = useCurrentUser({
    useErrorBoundary: false,
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
    onModel: AvailableModels.RECIPES,
  });

  if (!canEdit) {
    return null;
  }

  return (
    <Tooltip
      trigger={
        <Link
          // @ts-ignore
          href={`${href}?editor=true`}
          className={buttonStyles({
            appearance: 'spaceless',
            color: 'blue',
            className: 'px-2 py-1 h-9 w-9',
          })}
        >
          <PencilIcon className="w-5 h-5 mt-0.5" />
        </Link>
      }
    >
      Upravit
    </Tooltip>
  );
};
