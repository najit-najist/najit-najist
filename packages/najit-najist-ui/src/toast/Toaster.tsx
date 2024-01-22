import { FC } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export const Toaster: FC = () => {
  return <SonnerToaster position="top-right" invert={false} />;
};
