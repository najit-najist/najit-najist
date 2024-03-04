'use client';

import { reactTransitionContext } from '@contexts/reactTransitionContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks';
import { logger } from '@logger';
import { AppRouterInput, checkoutCartSchema } from '@najit-najist/api';
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
  }>
> = ({ children, defaultFormValues }) => {
  const [isDoingTransition, doTransition] = useTransition();
  const router = useRouter();
  const plausible = usePlausible();
  const { mutateAsync: doCheckout } = trpc.profile.cart.checkout.useMutation();
  const formMethods = useForm({
    defaultValues: defaultFormValues,
    resolver: zodResolver(checkoutCartSchema),
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
          municipality: newOrder.address_municipality.name,
          'delivery method': newOrder.delivery_method.name,
          'payment method': newOrder.payment_method.name,
        },
        revenue: {
          amount: getTotalPrice(newOrder),
          currency: 'CZK',
        },
      });

      for (const productInCart of newOrder.products) {
        plausible.trackEvent('Product ordered', {
          props: {
            name: productInCart.product.name,
            count: String(productInCart.count),
          },
        });
      }

      if (redirectTo.startsWith('http')) {
        window.location.replace(redirectTo);
      } else {
        doTransition(() => {
          router.push(`/muj-ucet/objednavky/${newOrder.id}`);
        });
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
