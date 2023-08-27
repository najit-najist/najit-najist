'use client';

import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ConsentForm, ConsentFormProps } from './ConsentForm';
import { ShieldCheckIcon } from '@heroicons/react/24/outline/index.js';
import { useGtag } from '@hooks';

const ANALYTICS_CONSENT_COOKIE_NAME = 'enable-najit-najist-analytics';
const MARKETING_CONSENT_COOKIE_NAME = 'enable-najit-najist-marketing';
const COOKIE_CONSENT_SHOWN = 'najit-najist-cookie-consent-shown';

export const CookieBanner: FC = () => {
  const { init: initGA } = useGtag();
  const [
    {
      'enable-najit-najist-analytics': analyticsCookie,
      'najit-najist-cookie-consent-shown': consentShown,
      'enable-najit-najist-marketing': marketingCookie,
    },
    setCookie,
  ] = useCookies([
    ANALYTICS_CONSENT_COOKIE_NAME,
    MARKETING_CONSENT_COOKIE_NAME,
    COOKIE_CONSENT_SHOWN,
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCookieNotice = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (consentShown === undefined) {
      setIsOpen(true);
      return;
    }

    setIsOpen(false);
  }, [consentShown]);

  useEffect(() => {
    if (analyticsCookie === 'true') {
      initGA();
    }
  }, [analyticsCookie, initGA]);

  const onFormSubmit = useCallback<ConsentFormProps['onSubmit']>(
    ({ analytics, marketing }) => {
      const nextYear = new Date();
      // Set expiry to next year
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      const cookieOptions: Parameters<typeof setCookie>[2] = {
        expires: nextYear,
      };

      setCookie(
        ANALYTICS_CONSENT_COOKIE_NAME,
        analytics ? 'true' : 'false',
        cookieOptions
      );
      setCookie(
        MARKETING_CONSENT_COOKIE_NAME,
        marketing ? 'true' : 'false',
        cookieOptions
      );
      setCookie(COOKIE_CONSENT_SHOWN, 'true', cookieOptions);

      setIsOpen(false);
    },
    [setCookie]
  );

  return (
    <>
      {isOpen ? (
        <section className="fixed left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] bottom-0 md:max-w-3xl lg:max-w-5xl w-full z-10">
          <div
            className={clsx(
              'bg-white p-6 rounded-lg shadow-2xl mb-3 sm:mb-5 border-deep-green-400 border-2'
            )}
          >
            <h1 className="text-2xl font-semibold">Cookies?</h1>

            <p className="text-gray-400 font-medium text-lg max-w-md">
              Na tomto webu využíváme{' '}
              <a
                href="https://cs.wikipedia.org/wiki/HTTP_cookie"
                rel="noopener"
              >
                cookies
              </a>{' '}
              pomocí nichž jsme schopni tento web vylepšovat.
            </p>

            <ConsentForm
              onSubmit={onFormSubmit}
              initialValues={{
                analytics:
                  analyticsCookie === undefined
                    ? true
                    : analyticsCookie === 'true',
                marketing:
                  marketingCookie === undefined
                    ? true
                    : marketingCookie === 'true',
              }}
            />
          </div>
        </section>
      ) : null}
      {isOpen ? null : (
        <button
          onClick={toggleCookieNotice}
          className="bg-white mb-2 sm:mr-5 sm:mb-5 rounded-full px-2 py-1 border-deep-green-400 border-2 fixed right-5 bottom-0 z-[114 text-xl"
        >
          <ShieldCheckIcon
            width={25}
            height={25}
            className="inline-block -mt-1 mr-2"
          />
          Cookies
        </button>
      )}
    </>
  );
};
