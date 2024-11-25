'use client';

import { updateMyAddressAction } from '@components/page-components/EditMyProfileContent/actions/updateMyAddressAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressUpdateInputSchema } from '@server/schemas/userAddressUpdateInputSchema';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormState,
  FormProvider as HookFormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function getChangedValues<G extends Record<any, any>>(
  allValues: G,
  dirtyFields: FormState<G>['dirtyFields'] | true,
): Partial<G> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      getChangedValues(allValues[key], (dirtyFields as any)[key]),
    ]),
  ) as Partial<G>;
}

export type FormData = z.infer<typeof userAddressUpdateInputSchema>;

export const FormProvider: FC<PropsWithChildren<{ initialData: FormData }>> = ({
  children,
  initialData,
}) => {
  const formMethods = useForm<FormData>({
    defaultValues: initialData,
    resolver: zodResolver(userAddressUpdateInputSchema),
  });
  const { handleSubmit, formState, reset, setError } = formMethods;

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (values) => {
      const nextValues = getChangedValues(values, formState.dirtyFields);

      // TODO provide correct typings
      // @ts-ignore
      if (nextValues.address && initialData.address?.id) {
        // @ts-ignore
        nextValues.address.id = initialData.address?.id;
      }

      const result = await updateMyAddressAction(nextValues);
      const isError = !!result.errors;

      if (isError) {
        for (const [errorFieldName, errorMessages] of Object.entries(
          result.errors ?? {},
        )) {
          setError(errorFieldName as any, {
            message: errorMessages.join(', '),
          });
        }

        toast.error(result.message);

        throw new Error('Failed with errors');
      }

      toast.success(result.message);

      reset(undefined, { keepValues: true });
    },
    [initialData, formState.dirtyFields, reset],
  );

  return (
    <HookFormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </HookFormProvider>
  );
};
