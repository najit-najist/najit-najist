import { useContext } from 'react';
import { loggedInUserContext } from '../contexts/loggedInUserContext';

export const useLoggedInUser = () => useContext(loggedInUserContext);
