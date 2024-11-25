'use client';

import { Button } from '@components/common/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { User, UserStates } from '@najit-najist/database/models';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FC, ReactElement, ReactNode, useTransition } from 'react';

import { deleteUserAction } from './deleteUserAction';
import { resetUserPasswordAdminAction } from './resetUserPasswordAdminAction';

type NavigationItem = {
  label: string;
  type?: 'delete' | 'normal';
  icon?: ReactElement;
  message: string;
  onClick: () => void;
};

const classnameForType: Record<NonNullable<NavigationItem['type']>, string> = {
  delete: clsx('bg-red-50 hover:bg-red-100 text-red-600'),
  normal: clsx('bg-gray-50 hover:bg-project-primary/10 text-project-accent'),
};

const Item: FC<NavigationItem & { disabled: boolean; isLoading: boolean }> = ({
  icon,
  label,
  type,
  onClick,
  disabled,
  isLoading,
}) => {
  return (
    <li>
      <Button
        onClick={onClick}
        color={type === 'delete' ? 'red' : 'ghost'}
        isLoading={isLoading}
        disabled={disabled}
        className="mt-2 w-full text-left"
        icon={icon}
      >
        {label}
      </Button>
    </li>
  );
};

export function EditLinks({ user }: { user: Pick<User, 'status' | 'id'> }) {
  const [isDeleting, startDeleting] = useTransition();
  const [isResetting, startResetting] = useTransition();
  const router = useRouter();

  const handlePasswordReset = () => {
    startResetting(async () => {
      await resetUserPasswordAdminAction({ user });
      router.refresh();
    });
  };
  const handleDelete = () => {
    startDeleting(async () => {
      await deleteUserAction({ user });
    });
  };

  return (
    <nav className="flex flex-1 flex-col mx-auto mt-10" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-1">
        <Item
          label={
            user.status === UserStates.PASSWORD_RESET
              ? 'Znovu poslat email na reset hesla'
              : 'Resetovat heslo'
          }
          onClick={handlePasswordReset}
          message={'Opravdu resetovat heslo?'}
          disabled={isDeleting}
          isLoading={isResetting}
        />

        <Item
          label="Odstranit"
          icon={<TrashIcon className="w-5 h-5 inline -mt-1 mr-2" />}
          type="delete"
          message="Opravdu vymazat uživatele?"
          onClick={handleDelete}
          disabled={isResetting}
          isLoading={isDeleting}
        />
      </ul>
    </nav>
  );
}
