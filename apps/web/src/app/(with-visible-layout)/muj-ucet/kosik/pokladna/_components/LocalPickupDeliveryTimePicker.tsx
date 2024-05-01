import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Alert, Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useController, useFormState } from 'react-hook-form';

export const LocalPickupDeliveryTimePicker: FC = () => {
  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const { field } = useController({
    name: 'localPickupTime',
  });

  return (
    <>
      <hr className="mt-8 mb-5 border-t border-gray-200" />

      <Alert
        className="w-full"
        heading="Vyberte čas vyzvednutí"
        color="warning"
        icon={ClockIcon}
      >
        <div>
          <p className="mb-4">
            Vyberte si čas vyzvednutí na prodejně, který Vám vyhovuje nejvíce!
          </p>
        </div>
        <Input
          className="max-w-36"
          disabled={formState.isSubmitting || isActive}
          {...field}
          min="10:00"
          max="18:00"
          type="time"
          required
        />
      </Alert>
    </>
  );
};
