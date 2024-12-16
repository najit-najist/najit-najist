'use client';

import { Button } from '@components/common/Button';
import { usePlausible } from '@hooks/usePlausible';
import { FC, useActionState } from 'react';

import { toggleNewsletterSubscriptionAction } from '../../toggleNewsletterSubscriptionAction';

export const ChangeNewsletterSubscriptionButton: FC<{
  initialValue: boolean;
}> = ({ initialValue }) => {
  const { trackEvent } = usePlausible();
  const [{ subscribed }, submit, isSubmitting] = useActionState(
    toggleNewsletterSubscriptionAction,
    {
      subscribed: initialValue,
      errors: {},
    },
  );

  return (
    <form
      onSubmit={() => {
        trackEvent('Newsletter subscription from footer');
      }}
      action={submit}
    >
      <Button
        type="submit"
        size="sm"
        className="whitespace-nowrap sm:ml-3 mt-3 sm:mt-0 w-full sm:w-48"
        isLoading={isSubmitting}
      >
        {subscribed ? 'Odhlásit můj účet' : 'Přihlásit můj účet'}
      </Button>
    </form>
  );
};
