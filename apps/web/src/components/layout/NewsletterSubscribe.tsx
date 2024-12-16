'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/form/Input';
import { usePlausible } from '@hooks/usePlausible';
import type { UserWithRelations } from '@server/services/UserService';
import { toggleNewsletterSubscriptionAction } from 'app/(with-visible-layout)/muj-ucet/toggleNewsletterSubscriptionAction';
import { cx } from 'class-variance-authority';
import Link from 'next/link';
import { FC, useActionState } from 'react';

export const NewsletterSubscribe: FC<{
  user: Pick<UserWithRelations, 'newsletter'> | undefined;
}> = ({ user }) => {
  const [{ errors, subscribed, email }, submit, isSubmitting] = useActionState(
    toggleNewsletterSubscriptionAction,
    { subscribed: undefined, errors: {} },
  );
  const userIsSubscribed = subscribed ?? user?.newsletter?.enabled;
  const { trackEvent } = usePlausible();

  return (
    <form
      onSubmit={() => {
        trackEvent('Newsletter subscription from footer');
      }}
      action={submit}
      className="relative bg-gradient-to-br from-project-primary to-deep-green-700 "
    >
      <div className="container py-10 sm:py-16 lg:flex lg:items-center lg:py-20">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-4xl font-bold tracking-tight text-white font-title">
            Přihlašte se k našemu newsletteru
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-cyan-100">
            Buďte vždy v obraze o novinkách a akcích z našeho webu.
          </p>
        </div>
        {!user ? (
          <div className="mt-6 sm:mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
            <div className="sm:flex">
              <input
                type="hidden"
                name="nextValue"
                value={!subscribed ? 'true' : 'false'}
              />
              <Input
                name="email"
                hideLabel
                type="email"
                placeholder="Váš email"
                autoComplete="email"
                size="md"
                defaultValue={email}
                label="Emailová adresa"
                rootClassName={cx('w-full', subscribed ? 'hidden' : '')}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className={cx(
                  'whitespace-nowrap mt-3 sm:mt-0 w-full',
                  subscribed ? '' : 'sm:ml-2 sm:w-auto',
                )}
                isLoading={isSubmitting}
              >
                {subscribed ? 'Odhlásit se' : 'Přihlásit se'}
              </Button>
            </div>
            {errors?.email ? (
              <Alert
                color="error"
                heading={errors?.email?.message}
                className="mt-3"
              />
            ) : null}

            <p className="mt-3 text-sm text-cyan-100">
              Záleží nám na vašich dat a jejich ochranu. Přečtě si naše{' '}
              <Link href="/gdpr" className="font-medium text-white underline">
                GDPR.
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex items-end flex-col gap-2">
            <Button
              type="submit"
              className="whitespace-nowrap sm:ml-3 mt-3 sm:mt-0 w-full sm:w-auto"
              appearance="filled"
              isLoading={isSubmitting}
            >
              {userIsSubscribed ? 'Odhlásit můj účet' : 'Přihlásit můj účet'}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
