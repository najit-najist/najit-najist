'use client';

import { useCurrentUser } from '@hooks';
import { FC } from 'react';

export const WelcomeMessage: FC = () => {
  const { data } = useCurrentUser({ trpc: { ssr: false } });

  return (
    <h1 className="text-4xl font-semibold mx-10">
      Vítejte, {data?.firstName}!
    </h1>
  );
};
