'use client';

import { Alert } from '@components/common/Alert';
import {
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
  loginPageCallbacks,
} from '@constants';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

export const Annoucements: FC = () => {
  const searchParams = useSearchParams();

  const isPasswordResetSuccessfulCallback = searchParams?.has(
    'passwordResetSuccessful',
  );
  const isPasswordResetCallback = searchParams?.has('passwordResetCallback');
  const isRegistrationCallback = searchParams?.has('registrationCallback');
  const isRegistrationPreviewCallback = searchParams?.has(
    loginPageCallbacks.previewRegistrationFinished,
  );
  const userNeedsToLoginBeforeContinuing = searchParams?.has(
    LOGIN_THEN_REDIRECT_TO_PARAMETER,
  );

  return (
    <>
      {isPasswordResetCallback ? (
        <Alert
          icon={InformationCircleIcon}
          color="success"
          className="mb-5 shadow-md"
          heading="Požadavek zpracován"
        >
          Dokončete změnu Vašeho hesla přes odkaz, který Vám byl zaslán pokud
          účet pod zadanou emailovou adresou existuje.
        </Alert>
      ) : null}
      {isPasswordResetSuccessfulCallback ? (
        <Alert
          icon={InformationCircleIcon}
          color="success"
          className="mb-5 shadow-md"
          heading="Heslo změněno"
        >
          Vaše heslo bylo úspěšně změněno! Nyní se můžete přihlásit pod novým
          heslem.
        </Alert>
      ) : null}
      {userNeedsToLoginBeforeContinuing ? (
        <Alert
          icon={InformationCircleIcon}
          color="warning"
          className="mb-5 shadow-md"
          heading="Sekce pouze pro přihlášené"
        >
          Pro pokračování se prosím přihlašte nebo se registrujte.
        </Alert>
      ) : null}
      {isRegistrationCallback ? (
        <Alert
          icon={InformationCircleIcon}
          color="success"
          className="mb-5 shadow-md"
          heading="Úspěšná registrace!"
        >
          Nyní dokončete registraci přes link, který Vám byl zaslán na email.
        </Alert>
      ) : null}
      {isRegistrationPreviewCallback ? (
        <Alert
          icon={InformationCircleIcon}
          color="success"
          className="mb-5 shadow-md"
          heading="Úspěšné dokončení registrace!"
        >
          Dokončení registrace bylo úspěšné a nyní se můžete přihlásit! Přejeme
          hodně štěstí!
        </Alert>
      ) : null}
    </>
  );
};
