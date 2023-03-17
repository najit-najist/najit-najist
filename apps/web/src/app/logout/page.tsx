import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const LogoutPage: FC = () => {
  const cookieStore = cookies();
  const session = cookieStore.delete(`najit-najist-session`);

  // TODO: destroy a session through API

  redirect(`/login`);
};

export default LogoutPage;
