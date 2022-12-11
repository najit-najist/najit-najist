'use client';

import { useCurrentUser } from '@hooks';
import { FC } from 'react';

const ProfilePage: FC = () => {
  const { data: user } = useCurrentUser();

  return (
    <>
      Welcome, {user?.firstName} {user?.lastName}
    </>
  );
};

export default ProfilePage;
