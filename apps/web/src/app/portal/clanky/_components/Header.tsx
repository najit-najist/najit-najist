'use client';

import { Button } from '@najit-najist/ui';
import { FC } from 'react';

export const Header: FC = () => {
  return (
    <div className="sm:flex sm:items-center px-10">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Články
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of all the users in your account including their name, title,
          email and role.
        </p>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <Button type="button">Přidat článek</Button>
      </div>
    </div>
  );
};
