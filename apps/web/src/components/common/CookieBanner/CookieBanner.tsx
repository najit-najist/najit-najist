'use client';

import { FC, useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { ConsentForm, ConsentFormProps } from './ConsentForm';
import { useCookieBannerVisibility } from './cookieBannerVisibilityStore';

const ANALYTICS_CONSENT_COOKIE_NAME = 'enable-najit-najist-analytics';
const MARKETING_CONSENT_COOKIE_NAME = 'enable-najit-najist-marketing';
const COOKIE_CONSENT_SHOWN = 'najit-najist-cookie-consent-shown';

export const CookieBanner: FC = () => {
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
  const { toggle, visible } = useCookieBannerVisibility();

  useEffect(() => {
    if (consentShown === undefined) {
      toggle(true);
      return;
    }

    toggle(false);
  }, [toggle, consentShown]);

  // useEffect(() => {
  //   if (analyticsCookie === 'true') {
  //     initGA();
  //   }
  // }, [analyticsCookie, initGA]);

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

      toggle(false);
    },
    [setCookie, toggle]
  );

  return (
    <>
      {visible ? (
        <section className="fixed left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] bottom-0 md:max-w-3xl lg:max-w-5xl w-full z-10">
          <div className="bg-white p-6 rounded-lg shadow-2xl mb-3 sm:mb-5 border-project-accent border-2">
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
    </>
  );
};
