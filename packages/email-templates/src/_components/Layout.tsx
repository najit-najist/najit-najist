// @ts-expect-error -- its okay
import { getTheme } from '@najit-najist/tailwind-plugin/index.cjs';
import { Head, Html, Img, Link } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import { FC, PropsWithChildren } from 'react';

import { Attachment, BaseEmailProps } from '../types';
import { Fonts } from './Fonts';
import { Text } from './Text';

const { plugins, ...theme } = getTheme();

export const Layout: FC<
  PropsWithChildren<
    {
      title?: string;
      attachments?: Array<Attachment>;
      siteOrigin: string;
    } & BaseEmailProps
  >
> = ({ title, newsletterUuid, children, siteOrigin, attachments }) => {
  return (
    <Tailwind config={theme}>
      <Html lang="cs">
        <Head>
          <title>{title}</title>
          <Fonts />

          <style
            dangerouslySetInnerHTML={{
              __html: `
            * {
              font-family: Montserrat, Helvetica;
            }
            h1, h2, h3 {
              font-family: 'DM Serif Display', serif;
              margin: 0;
              margin-top: 0;
              margin-bottom: 0;
            }
            `,
            }}
          ></style>
        </Head>
        <main className="bg-white px-4 py-10">
          <div className="px-5 py-4">
            <Img
              src={`${siteOrigin}/logo.png`}
              className="w-full max-w-[150px] h-auto mx-auto rounded-md block"
              alt="Najit&Najíst logo"
              title="Najit&Najíst logo"
              width="400"
              height="90"
            />
          </div>
          <div className="rounded-md bg-white">{children}</div>
          <footer className="text-center text-[#898989]">
            <Text
              className="italic my-3"
              spacing={false}
              color="subtle"
              size="small"
            >
              Váš team{' '}
              <Link className="text-project-accent" href={siteOrigin}>
                najitnajist.cz
              </Link>{' '}
              {' @ '}
              {new Date().getFullYear()}
            </Text>

            {newsletterUuid ? (
              <Text
                spacing={false}
                color="subtle"
                size="small"
                className="mb-2 mt-10"
              >
                Pokud již nemáte zájem o tento typ emailu tak je možné se
                odhlásit{' '}
                <a
                  href={`${siteOrigin}/preference/newsletter/${newsletterUuid}?next_state=false`}
                >
                  zde
                </a>
                !
              </Text>
            ) : null}
          </footer>
        </main>
      </Html>
    </Tailwind>
  );
};
