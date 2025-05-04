'use client';

import { reactTransitionContext } from '@contexts/reactTransitionContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks/usePlausible';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { OrderDeliveryMethodsSlug } from '@najit-najist/database/models';
import { userCartCheckoutInputSchema } from '@najit-najist/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { handlePromiseForToast } from '@utils/handleActionForToast';
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
import { toast } from 'sonner';
import { z } from 'zod';

import { doCheckoutAction } from '../doCheckoutAction';
import { FormValues } from './types';

type OptionalFormValues = Omit<
  FormValues,
  'paymentMethod' | 'deliveryMethod'
> & {
  paymentMethod: { slug: null | string };
  deliveryMethod: { slug: null | string };
};

const resolver = zodResolver(
  userCartCheckoutInputSchema.superRefine((value, ctx) => {
    if (
      value.deliveryMethod.slug ===
        OrderDeliveryMethodsSlug.DELIVERY_HRADEC_KRALOVE &&
      value.address.municipality.slug !== 'hradec-kralove'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Pro dopravu kurýrem musíte mít dodací adresu v Hradci Králové',
        fatal: true,
        path: ['address.municipality'],
      });
    }
  }),
);

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
    defaultValues: defaultFormValues as any,
    resolver,
  });
  const { handleSubmit, setError } = formMethods;

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (formValues) => {
      const newOrderAsPromise = doCheckoutAction(formValues).then(
        async (response) => {
          console.log({ response });
          if (response?.errors) {
            const errorsAsArray = Object.entries(response.errors);
            for (const [key, value] of errorsAsArray) {
              setError(key as any, value);
            }

            throw new Error('Opravte si hodnoty ve formuláři');
          }
        },
      );

      toast.promise(handlePromiseForToast(newOrderAsPromise), {
        loading: 'Vytvářím objednávku...',
        success:
          'Objednávka vytvořena, děkujeme! Brzy Vás budeme kontaktovat o dalších krocích',
        error(error) {
          return `Stala se chyba při vytváření objednávky: ${error.message}`;
        },
      });

      await newOrderAsPromise;
      await queryClient.invalidateQueries({ queryKey: useUserCartQueryKey });
    },
    [router, plausible, queryClient],
  );

  return (
    <reactTransitionContext.Provider
      value={useMemo(
        () => ({ isActive: isDoingTransition, startTransition: doTransition }),
        [isDoingTransition, doTransition],
      )}
    >
      <ReactHookFormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit as any)}>{children}</form>
      </ReactHookFormProvider>
    </reactTransitionContext.Provider>
  );
};
