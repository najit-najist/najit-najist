import { FC } from 'react';

import { ConsentForm } from './ConsentForm';
import { Wrapper } from './Wrapper';
import { getConsentState } from './consentState';

export const CookieBanner: FC = async () => {
  const consentState = await getConsentState();

  return (
    <Wrapper defaultOpenened={!consentState?.shown}>
      <section className="fixed left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] bottom-0 md:max-w-3xl lg:max-w-5xl w-full z-10">
        <div className="bg-white p-6 rounded-project shadow-2xl mb-3 sm:mb-5 border-project-accent border-2">
          <h1 className="text-2xl font-semibold">Cookies?</h1>

          <p className="text-gray-400 font-medium text-lg max-w-md">
            Na tomto webu využíváme{' '}
            <a href="https://cs.wikipedia.org/wiki/HTTP_cookie" rel="noopener">
              cookies
            </a>{' '}
            pomocí nichž jsme schopni tento web vylepšovat.
          </p>

          <ConsentForm initialValues={consentState} />
        </div>
      </section>
    </Wrapper>
  );
};
