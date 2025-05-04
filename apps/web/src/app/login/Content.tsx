'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Input } from '@components/common/form/Input';
import { PasswordInput } from '@components/common/form/PasswordInput';
import { APP_BASE_URL } from '@constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks/usePlausible';
import { userProfileLogInInputSchema } from '@server/schemas/userProfileLogInInputSchema';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginAction } from './loginAction';

type FormValues = z.infer<typeof userProfileLogInInputSchema> & {
  errorPot?: string;
};

export const Content: FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const { trackEvent } = usePlausible();
  const searchParams = useSearchParams();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(userProfileLogInInputSchema) as any,
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = formMethods;

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

      // TODO: this is for reloading cache on client
      const newUrl = new URL(redirectTo, APP_BASE_URL);
      window.location.href = newUrl.toString();
    },
    [trackEvent, searchParams, setError, redirectTo],
  );

  return (
    <div className="bg-white py-5 px-4 shadow rounded-project sm:px-5">
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
          <div className="flex justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Heslo
            </label>
            <Link
              href="/zapomenute-heslo"
              className={buttonStyles({
                appearance: 'link',
                size: 'sm',
              })}
            >
              Zapomenuté heslo?
            </Link>
          </div>
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

        <div className="flex">
          <Button
            isLoading={isSubmitting || isSubmitSuccessful}
            type="submit"
            className="shadow-sm mx-auto w-full max-w-40"
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
  );
};
