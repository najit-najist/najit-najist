'use client';

import { loginInputSchema } from '@najit-najist/api';
import { Button, ErrorMessage, Input, PasswordInput } from '@najit-najist/ui';
import { FC, useCallback } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BottomLinks } from './components/BottomLInks';
import { Title } from './components/Title';
import { SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from 'trpc';
import type { TRPCError } from '@trpc/server';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@najit-najist/ui';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type FormValues = z.infer<typeof loginInputSchema> & { errorPot: string };

export const Content: FC = () => {
  const { mutateAsync: doLogin } = trpc.profile.login.useMutation();
  const searchParams = useSearchParams();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(loginInputSchema),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = formMethods;
  const router = useRouter();
  const isRegistrationCallback = searchParams?.has('registrationCallback');

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      try {
        await doLogin(values);

        router.push('/portal');
      } catch (error) {
        const message = (error as TRPCError).message;

        // TODO: Unify error code
        if (message == 'Invalid credentials') {
          setError('email', { message: 'Nesprávné přihlašovací údaje' });
          setError('password', { message: 'Nesprávné přihlašovací údaje' });
        } else if ((error as TRPCError).code === 'FORBIDDEN') {
          setError('errorPot', {
            message,
          });
        } else {
          setError('errorPot', {
            message: `Nečekaná chyba: ${message}`,
          });
        }
      }
    },
    [doLogin, router, setError]
  );

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto w-full">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {isRegistrationCallback ? (
          <Alert
            icon={InformationCircleIcon}
            color="success"
            className="mb-8 shadow-md"
            heading="Úspěšná registrace!"
          >
            Nyní dokončete registraci přes link, který Vám byl zaslán na email.
          </Alert>
        ) : null}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
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
                Password
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
                isLoading={isSubmitting}
                type="submit"
                size="normal"
                className="shadow-sm w-full"
              >
                {isSubmitting ? 'Přihlašuji...' : 'Přihlásit se'}
              </Button>
            </div>
            {errors.errorPot?.message ? (
              <ErrorMessage className="!mt-1.5 font-semibold block text-center">
                {errors.errorPot?.message}
              </ErrorMessage>
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
