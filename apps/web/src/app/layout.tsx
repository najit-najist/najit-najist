import '../globals.css';
import { LayoutComponent } from '@custom-types';
import { ContextProviders } from '@contexts';
import { Suez_One, Playfair_Display, Montserrat } from 'next/font/google';
import { headers } from 'next/headers';
import clsx from 'clsx';

// @ts-ignore
import('dayjs/locale/cs');

const inter = Suez_One({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({
  weight: ['400', '700'],
  style: ['italic', 'normal'],
  subsets: ['latin'],
});
const montserrat = Montserrat({
  weight: ['300', '400', '700', '800'],
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
          'bg-gradient-to-b from-[#fbf9eb] to-white data-scroll-container min-h-screen flex',
          inter.className,
          playfair.className,
          montserrat.className
        )}
      >
        <ContextProviders cookies={headersStore.get('cookie') ?? undefined}>
          {children}
        </ContextProviders>
      </body>
    </html>
  );
};

export default RootLayout;
