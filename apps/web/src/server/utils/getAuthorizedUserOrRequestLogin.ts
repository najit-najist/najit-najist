import { redirect } from 'next/navigation';

import { getCachedLoggedInUser } from './getCachedLoggedInUser';

export const getAuthorizedUserOrRequestLogin = async () => {
  const loggedInUser = await getCachedLoggedInUser();

  if (!loggedInUser) {
    // TODO: Add redirect back url
    redirect('/login');
  }

  return loggedInUser;
};
