import { PropsWithChildren } from 'react';

export const metadata = {
  robots: {
    follow: false,
    index: false,
    googleBot: {
      follow: false,
      index: false,
    },
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
