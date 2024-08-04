'use client';

import {
  loginPageCallbacks,
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
  LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER,
} from '@constants';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks';
import { Button, Input, PasswordInput } from '@najit-najist/ui';
import { Alert } from '@najit-najist/ui';
import { userProfileLogInInputSchema } from '@server/schemas/userProfileLogInInputSchema';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BottomLinks } from './_components/BottomLInks';
import { Title } from './_components/Title';
import { loginAction } from './loginAction';

type FormValues = z.infer<typeof userProfileLogInInputSchema> & {
  errorPot: string;
};

export const Content: FC = () => {
  const { trackEvent } = usePlausible();
  const searchParams = useSearchParams();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(userProfileLogInInputSchema),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = formMethods;

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

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      await loginAction(values).then(async (response) => {
        if (response?.errors) {
          console.log(response);
          const errorsAsArray = Object.entries(response.errors);
          for (const [key, value] of errorsAsArray) {
            setError(key as any, value);
          }

          throw new Error('Opravte si hodnoty ve formuláři');
        }
      });
      trackEvent('User logged in');

      const redirectTo =
        searchParams?.get(LOGIN_THEN_REDIRECT_TO_PARAMETER) ??
        searchParams?.get(LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER) ??
        '/muj-ucet/profil';

      // TODO: this is for reloading cache on client
      const newUrl = new URL(redirectTo, window.location.origin);

      newUrl.host = window.location.host;
      window.location.href = newUrl.toString();
    },
    [trackEvent, searchParams, setError],
  );

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto w-full">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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
            Dokončení registrace bylo úspěšné a nyní se můžete přihlásit!
            Přejeme hodně štěstí!
          </Alert>
        ) : null}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            autoComplete="on"
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Emailová adresa
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  error={errors.email}
                  disabled={isSubmitting || isSubmitSuccessful}
                  {...register('email')}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Heslo
              </label>
              <div className="mt-1">
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  required
                  error={errors.password}
                  disabled={isSubmitting || isSubmitSuccessful}
                  {...register('password')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* TODO: is this really necessary */}
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Pamatuj si mě
                </label>
              </div> */}
              {/* Just a placeholder */}
              <div />

              <div className="text-sm">
                <Link
                  href="/zapomenute-heslo"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Zapomenuté heslo?
                </Link>
              </div>
            </div>

            <div>
              <Button
                isLoading={isSubmitting || isSubmitSuccessful}
                type="submit"
                appearance="normal"
                className="shadow-sm w-full"
              >
                {isSubmitting || isSubmitSuccessful
                  ? 'Přihlašuji...'
                  : 'Přihlásit se'}
              </Button>
            </div>
            {errors.root?.message ? (
              <Alert color="error" heading="Chyba" className="!mt-1.5 ">
                {errors.root?.message}
              </Alert>
            ) : null}
          </form>

          {/* TODO: disabled */}
          {/* <SSO /> */}
        </div>
        <BottomLinks />
      </div>
    </div>
  );
};
