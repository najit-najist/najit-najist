import 'react-color-palette/lib/css/styles.css';
import '../globals.css';
import 'keen-slider/keen-slider.min.css';
import { LayoutComponent } from '@custom-types';
import { ContextProviders } from '@contexts';
import { Suez_One, Playfair_Display, Montserrat } from 'next/font/google';
import { headers } from 'next/headers';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { CookieBanner } from '@components/common/CookieBanner';

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
const playfair = Playfair_Display({
  weight: ['400', '700'],
  variable: '--font-playfair-display',
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
    default: 'Hlavní stránka',
  },
  viewport: 'width=device-width',
  creator: 'Ondřej Langr <hi@ondrejlangr.cz>',
  publisher: 'najitnajist',
};

const RootLayout: LayoutComponent = ({ children }) => {
  const headersStore = headers();

  return (
    <html lang="cs">
      <body
        className={clsx(
          'bg-gradient-to-b from-[#fbf9ebd3] to-white data-scroll-container min-h-screen flex',
          inter.className,
          playfair.className,
          montserrat.className,
          inter.variable,
          playfair.variable,
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
