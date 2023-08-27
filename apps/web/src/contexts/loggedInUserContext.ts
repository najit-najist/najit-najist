import { User } from '@najit-najist/api';
import { createContext } from 'react';

export const loggedInUserContext = createContext<User | undefined>(undefined);
