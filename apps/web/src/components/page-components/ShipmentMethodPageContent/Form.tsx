'use client';

import { PropsWithChildren, useCallback } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';

import { FormValues } from './FormProvider';
import { createShipmentMethodAction } from './actions/createShipmentMethodAction';
import { updateShipmentMethodAction } from './actions/updateShipmentMethodAction';

export function Form({
  methodId,
  children,
}: PropsWithChildren<{
  methodId?: number;
}>) {
  const { setError, handleSubmit } = useFormContext<FormValues>();

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      const response =
        (await (methodId
          ? updateShipmentMethodAction({ id: methodId!, values })
          : createShipmentMethodAction(values))) ?? {};

      if ('errors' in response) {
        // for (const key in response.errors) {
        //   setError(key as any, response.errors[key]);
        // }

        throw new Error('Submit failed because of errors on server');
      }
    },
    [setError, methodId],
  );

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
}
