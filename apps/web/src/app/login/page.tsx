import {
  APP_BASE_URL,
  LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER,
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
} from '@constants';
import { Suspense } from 'react';

import { Annoucements } from './Annoucements';
import { Content } from './Content';
import { BottomLinks } from './_components/BottomLInks';
import { Title } from './_components/Title';

export const metadata = {
  title: 'Přihlášení',
};

export default async function LoginPage({
  searchParams: getSearchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await getSearchParams;

  const redirectTo =
    searchParams[LOGIN_THEN_REDIRECT_TO_PARAMETER] ??
    searchParams[LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER];

  const redirectToUrl = new URL(
    typeof redirectTo === 'string' ? redirectTo : '/muj-ucet/profil',
    APP_BASE_URL,
  );

  return (
    <div className="flex min-h-full flex-col container justify-center w-full py-10">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense>
          <Annoucements />
        </Suspense>
        <Content
          redirectTo={redirectToUrl
            .toString()
            .replace(redirectToUrl.origin, '')}
        />
        <BottomLinks />
      </div>
    </div>
  );
}
