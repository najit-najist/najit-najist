'use client';

import { reactTransitionContext } from '@contexts/reactTransitionContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { userCartCheckoutInputSchema } from '@najit-najist/schemas';
import { toast } from '@najit-najist/ui';
import { useQueryClient } from '@tanstack/react-query';
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

import { doCheckoutAction } from '../actions';
import { FormValues } from './types';

type OptionalFormValues = Omit<
  FormValues,
  'paymentMethod' | 'deliveryMethod'
> & {
  paymentMethod: { slug: null | string };
  deliveryMethod: { slug: null | string };
};

export const FormProvider: FC<
  PropsWithChildren<{
    defaultFormValues?: OptionalFormValues;
  }>
> = ({ children, defaultFormValues }) => {
  const [isDoingTransition, doTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();
  const plausible = usePlausible();
  const formMethods = useForm({
    defaultValues: defaultFormValues,
    resolver: zodResolver(userCartCheckoutInputSchema),
  });
  const { handleSubmit, setError } = formMethods;

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (formValues) => {
      const newOrderAsPromise = doCheckoutAction(formValues).then(
        async (response) => {
          if (response?.errors) {
            console.log(response);
            const errorsAsArray = Object.entries(response.errors);
            for (const [key, value] of errorsAsArray) {
              setError(key as any, value);
            }

            throw new Error('Opravte si hodnoty ve formuláři');
          }
        }
      );

      toast.promise(newOrderAsPromise, {
        loading: 'Vytvářím objednávku...',
        success:
          'Objednávka vytvořena, děkujeme! Nyní Vás přesměrujeme dále, vyčkejte strpení...',
        error(error) {
          return `Stala se chyba při vytváření objednávky: ${error.message}`;
        },
      });

      await newOrderAsPromise;
      await queryClient.invalidateQueries({ queryKey: useUserCartQueryKey });
    },
    [router, plausible, queryClient]
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
