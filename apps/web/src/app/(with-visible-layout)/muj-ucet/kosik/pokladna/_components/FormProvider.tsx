'use client';

import { reactTransitionContext } from '@contexts/reactTransitionContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks';
import { logger } from '@logger';
import { AppRouterInput } from '@najit-najist/api';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import {
  pickupTimeSchema,
  userCartCheckoutInputSchema,
} from '@najit-najist/schemas';
import { toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { getTotalPrice } from '@utils';
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

type FormValues = AppRouterInput['profile']['cart']['checkout'];
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
  const { mutateAsync: doCheckout } = trpc.profile.cart.checkout.useMutation();

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
  const { handleSubmit } = formMethods;

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (formValues) => {
      const newOrderPromise = doCheckout(formValues).catch((error) => {
        logger?.error(`Failed to create order because, ${error.message}`, {
          error,
        });

        throw error;
      });

      toast.promise(newOrderPromise, {
        loading: 'Vytvářím objednávku...',
        success: 'Objednávka vytvořena, děkujeme!',
        error(error) {
          return `Stala se chyba při vytváření objednávky: ${error.message}`;
        },
      });

      const { order: newOrder, redirectTo } = await newOrderPromise;

      plausible.trackEvent('User order', {
        props: {
          // TODO: print names instead
          municipality: formValues.address.municipality.id.toString(),
          'delivery method': formValues.deliveryMethod.id.toString(),
          'payment method': formValues.paymentMethod.id.toString(),
        },
        revenue: {
          amount: getTotalPrice(newOrder),
          currency: 'CZK',
        },
      });

      // for (const productInCart of newOrder.products) {
      //   plausible.trackEvent('Product ordered', {
      //     props: {
      //       name: productInCart.product.name,
      //       count: String(productInCart.count),
      //     },
      //   });
      // }

      if (redirectTo.startsWith('http')) {
        window.location.replace(redirectTo);
      } else {
        doTransition(() => {
          router.push(redirectTo as any);
        });
        await trpcUtils.profile.cart.products.get.many.invalidate();
      }
    },
    [doCheckout, router, plausible]
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
