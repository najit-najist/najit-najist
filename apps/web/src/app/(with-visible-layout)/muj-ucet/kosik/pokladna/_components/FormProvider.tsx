'use client';

import { reactTransitionContext } from '@contexts/reactTransitionContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { logger } from '@logger';
import { AppRouterInput, checkoutCartSchema } from '@najit-najist/api';
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
  const { mutateAsync: doCheckout } = trpc.profile.cart.checkout.useMutation();
  const formMethods = useForm({
    defaultValues: defaultFormValues,
    resolver: zodResolver(checkoutCartSchema),
  });
  const { handleSubmit } = formMethods;

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (formValues) => {
      const newOrder = await toast
        .promise(doCheckout(formValues), {
          loading: 'Vytvářím objednávku...',
          success: 'Objednávka vytvořena, děkujeme!',
          error(error) {
            return `Stala se chyba při vytváření objednávky: ${error.message}`;
          },
        })
        .catch((error) => {
          logger?.error(`Failed to create order because, ${error.message}`, {
            error,
          });

          throw error;
        });

      doTransition(() => {
        router.push(`/muj-ucet/objednavky/${newOrder.id}`);
      });
    },
    [doCheckout, router]
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
