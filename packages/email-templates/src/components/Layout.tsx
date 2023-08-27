import { FC, PropsWithChildren } from 'react';
import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Attachment, BaseEmailProps } from '../types';
import { Head } from '@react-email/head';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Font } from '@react-email/font';
import { Text } from './Text';

export const Layout: FC<
  PropsWithChildren<
    {
      title?: string;
      attachments?: Array<Attachment>;
    } & BaseEmailProps
  >
> = ({ title, newsletterUuid, children, attachments }) => {
  return (
    <Tailwind 
    config={{
      theme: {
        extend: {
          colors: {
            deep: {
              green: {
                300: '#0D8F3C',
                400: '#119447',
                500: '#3f7652',
                700: '#0a4924',
              },
            },
          },
        },
      },
    }}>
      <Html lang="cs">
        <Head>
          <title>{title}</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap',
              format: 'embedded-opentype',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <main className="bg-[#edf0f3] px-6 py-20">
          <div className="max-w-md mx-auto">
            <div className="p-5">
              <Img
                src="https://dev.najitnajist.cz/logo.png"
                className="w-full max-w-[150px] h-auto mx-auto rounded-md block"
                alt="Najit&Najíst logo"
                title="Najit&Najíst logo"
                width="400"
                height="90"
              />
            </div>
            <div className="p-5 rounded-md text-center bg-white">
              {children}
            </div>
            <footer className="text-center text-[#898989]">
              <Text
                spacing={false}
                color="subtle"
                size="small"
                className="font-bold my-3"
              >
                <Link className="text-deep-green-400" href="https://www.najitnajist.cz">Najít&Najíst Team</Link>
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
                    href={`https://najitnajist.cz/preference/newsletter/${newsletterUuid}?next_state=false`}
                  >
                    zde
                  </a>
                  !
                </Text>
              ) : null}
            </footer>
          </div>
        </main>
      </Html>
    </Tailwind>
  );
};
