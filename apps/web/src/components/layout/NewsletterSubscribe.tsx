'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUser } from '@hooks';
import { subscribeToNewsletterSchema } from '@najit-najist/api';
import { Button, buttonStyles, Input } from '@najit-najist/ui';
import { trpc } from '@trpc';
import Link from 'next/link';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

// TODO: make this work

export const NewsletterSubscribe: FC = () => {
  const formMethods = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(subscribeToNewsletterSchema),
  });
  const { handleSubmit, register, formState } = formMethods;
  const { data } = useCurrentUser({
    useErrorBoundary: false,
    retry: false,
    trpc: {
      ssr: false,
    },
  });

  const { mutateAsync: subscribe } = trpc.newsletter.subscribe.useMutation();
  const onSubmit: Parameters<typeof handleSubmit>['0'] = async ({ email }) => {
    await subscribe({ email });
  };

  return (
    <div className="relative container">
      <div className="rounded-3xl bg-gradient-to-br from-deep-green-300 to-deep-green-700 py-10 px-6 sm:py-16 sm:px-12 lg:flex lg:items-center lg:py-20 lg:px-20">
        {formState.isSubmitSuccessful ? (
          <>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Jste přihlášeni k novinkám
              <br /> Děkujeme!
            </h2>
          </>
        ) : (
          <>
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Přihlašte se k našemu newsletteru
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-cyan-100">
                Buďte vždy v obraze o novinkách a akcích z našeho webu.
              </p>
            </div>
            {!data ? (
              <div className="mt-6 sm:mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                <form onSubmit={handleSubmit(onSubmit)} className="sm:flex">
                  <Input
                    type="email"
                    placeholder="Váš email"
                    autoComplete="email"
                    size="md"
                    label="Emailová adresa"
                    rootClassName="w-full"
                    hideLabel
                    error={formState.errors.email}
                    {...register('email')}
                  />
                  <Button
                    type="submit"
                    color="sweet"
                    className="whitespace-nowrap sm:ml-3 mt-3 sm:mt-0 w-full sm:w-auto"
                    isLoading={formState.isSubmitting}
                  >
                    Přihlásit se
                  </Button>
                </form>

                <p className="mt-3 text-sm text-cyan-100">
                  Záleží nám na vašich dat a jejich ochranu. Přečtě si naše{' '}
                  <Link
                    href="/gdpr"
                    className="font-medium text-white underline"
                  >
                    GDPR.
                  </Link>
                </p>
              </div>
            ) : (
              <div className="flex items-end flex-col gap-2">
                <p className="text-white">
                  {data.newsletter
                    ? 'Jste již přihlášeni'
                    : 'Zatím nejste přihlášeni'}{' '}
                  k novinkám
                </p>
                <Link
                  href="/muj-ucet/profil"
                  className={buttonStyles({ color: 'sweet' })}
                >
                  Změnit
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
