import { UserWithRelations } from '@custom-types';
import { createContext } from 'react';

export const loggedInUserContext = createContext<UserWithRelations | undefined>(
  undefined
);
