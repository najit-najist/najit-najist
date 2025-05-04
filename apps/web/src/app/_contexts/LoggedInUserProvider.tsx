'use client';

import { UserWithRelations } from '@server/services/UserService';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

const context = createContext<UserWithRelations | undefined>(undefined);

export const LoggedInUserProvider: FC<
  PropsWithChildren<{ value: UserWithRelations | undefined }>
> = ({ value, children }) => (
  <context.Provider value={value}>{children}</context.Provider>
);

export const useLoggedInUser = () => useContext(context);
export const useRequiredLoggedInUser = () => {
  const user = useLoggedInUser();

  if (!user) {
    throw new Error('Musí být přihlášeni');
  }

  return user;
};
