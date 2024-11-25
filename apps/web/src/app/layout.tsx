import { CookieBanner } from '@components/common/CookieBanner';
import { Toaster } from '@components/common/toast';
import { ContextProviders } from '@contexts/ContextProviders';
import { LayoutComponent } from '@custom-types';
import clsx from 'clsx';
import 'keen-slider/keen-slider.min.css';
import { Suez_One, Montserrat, DM_Serif_Display } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
import 'react-color-palette/dist/css/rcp.css';

import '../globals.css';

const inter = Suez_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-suez',
});
const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  variable: '--font-dm-serif-display',
  style: ['italic', 'normal'],
  subsets: ['latin'],
});
const montserrat = Montserrat({
  weight: ['300', '400', '700', '800'],
  variable: '--font-montserrat',
  style: ['italic', 'normal'],
  subsets: ['latin'],
});

export const metadata = {
  title: {
    template: '%s | Najít Najíst',
    default: 'Najít Najíst',
  },
  creator: 'Ondřej Langr <hi@ondrejlangr.cz>',
  publisher: 'najitnajist',
};

export const viewport = {
  width: 'device-width',
};

const RootLayout: LayoutComponent = async ({ children }) => {
  const headersStore = await headers();

  return (
    <html lang="cs">
      <head>
        {process.env.NODE_ENV === 'production' ? (
          <Script
            defer
            key="plausible"
            data-domain="najitnajist.cz"
            src="https://plausible.io/js/script.js"
          />
        ) : null}
      </head>
      <body
        className={clsx(
          'bg-project-background data-scroll-container min-h-screen flex text-project-text',
          // inter.className,
          // dmSerifDisplay.className,
          montserrat.className,
          inter.variable,
          dmSerifDisplay.variable,
          montserrat.variable,
        )}
      >
        <ContextProviders cookies={headersStore.get('cookie') ?? undefined}>
          {children}
          <CookieBanner />
          <Toaster />
        </ContextProviders>
      </body>
    </html>
  );
};

export default RootLayout;
