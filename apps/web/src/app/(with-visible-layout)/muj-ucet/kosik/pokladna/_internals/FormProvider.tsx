'use client';

import { reactTransitionContext } from '@contexts/reactTransitionContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import {
  pickupTimeSchema,
  userCartCheckoutInputSchema,
} from '@najit-najist/schemas';
import { toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useTransition,
} from 'react';
import {
  FormProvider as ReactHookFormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { doCheckoutAction } from '../actions';
import { FormValues } from './types';

type OptionalFormValues = Omit<
  FormValues,
  'paymentMethod' | 'deliveryMethod'
> & {
  paymentMethod: { id: null | string };
  deliveryMethod: { id: null | string };
};

export const FormProvider: FC<
  PropsWithChildren<{
    defaultFormValues?: OptionalFormValues;
    localPickupDeliveryMethodId: OrderDeliveryMethod['id'];
  }>
> = ({ children, defaultFormValues, localPickupDeliveryMethodId }) => {
  const [isDoingTransition, doTransition] = useTransition();
  const trpcUtils = trpc.useUtils();
  const router = useRouter();
  const plausible = usePlausible();

  const resolver = useMemo(
    () =>
      zodResolver(
        userCartCheckoutInputSchema.superRefine((value, ctx) => {
          if (value.deliveryMethod.id === localPickupDeliveryMethodId) {
            const validatedPickupDate = pickupTimeSchema.safeParse(
              value.localPickupTime
            );

            if (!validatedPickupDate.success) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: validatedPickupDate.error.format()._errors.join(', '),
                fatal: true,
                path: ['localPickupTime'],
              });
            }
          }
        })
      ),
    [localPickupDeliveryMethodId]
  );
  const formMethods = useForm({
    defaultValues: defaultFormValues,
    resolver,
  });
  const { handleSubmit, setError } = formMethods;

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (formValues) => {
      const newOrderAsPromise = doCheckoutAction(formValues);

      toast.promise(newOrderAsPromise, {
        loading: 'Vytvářím objednávku...',
        success: 'Objednávka vytvořena, děkujeme!',
        error(error) {
          return `Stala se chyba při vytváření objednávky: ${error.message}`;
        },
      });

      const { errors } = (await newOrderAsPromise) ?? {};

      if (!errors) {
        await trpcUtils.profile.cart.products.get.many.invalidate();
      } else {
        const errorsAsArray = Object.entries(errors);
        for (const [key, value] of errorsAsArray) {
          setError(key as any, value);
        }
      }
    },
    [router, plausible]
  );

  return (
    <reactTransitionContext.Provider
      value={useMemo(
        () => ({ isActive: isDoingTransition, startTransition: doTransition }),
        [isDoingTransition, doTransition]
      )}
    >
      <ReactHookFormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit as any)}>{children}</form>
      </ReactHookFormProvider>
    </reactTransitionContext.Provider>
  );
};
