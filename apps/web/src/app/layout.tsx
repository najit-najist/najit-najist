import 'react-color-palette/lib/css/styles.css';
import '../globals.css';
import 'keen-slider/keen-slider.min.css';
import { LayoutComponent } from '@custom-types';
import { ContextProviders } from '@contexts';
import { Suez_One, Montserrat, DM_Serif_Display } from 'next/font/google';
import { headers } from 'next/headers';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { CookieBanner } from '@components/common/CookieBanner';
import Script from 'next/script';
import { GA_KEY } from '@constants';

dayjs.extend(timezone);
dayjs.extend(relativeTime);

// @ts-ignore
import('dayjs/locale/cs');
dayjs.locale('cs');

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
    default: 'Hlavní stránka | Najít Najíst',
  },
  viewport: 'width=device-width',
  creator: 'Ondřej Langr <hi@ondrejlangr.cz>',
  publisher: 'najitnajist',
};

const RootLayout: LayoutComponent = ({ children }) => {
  const headersStore = headers();

  return (
    <html lang="cs">
      <head>
        <Script
          key="googletagmanager"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_KEY}`}
        />
      </head>
      <body
        className={clsx(
          'bg-gradient-to-b from-[#fbf9ebd3] to-white data-scroll-container min-h-screen flex',
          // inter.className,
          // dmSerifDisplay.className,
          montserrat.className,
          inter.variable,
          dmSerifDisplay.variable,
          montserrat.variable
        )}
      >
        <ContextProviders cookies={headersStore.get('cookie') ?? undefined}>
          {children}
          <CookieBanner />
        </ContextProviders>
      </body>
    </html>
  );
};

export default RootLayout;
