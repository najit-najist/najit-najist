'use client';

import { PropsWithChildren, useCallback } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';

import { FormValues } from './FormProvider';
import { createProductRawMaterialAction } from './actions/createProductRawMaterialAction';
import { updateProductRawMaterialAction } from './actions/updateProductRawMaterialAction';

export function Form({
  rawMaterialId,
  children,
}: PropsWithChildren<{
  rawMaterialId?: number;
}>) {
  const { setError, handleSubmit } = useFormContext<FormValues>();

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      const response =
        (await (rawMaterialId
          ? updateProductRawMaterialAction({ id: rawMaterialId!, data: values })
          : createProductRawMaterialAction(values))) ?? {};

      if ('errors' in response) {
        for (const key in response.errors) {
          setError(key as any, response.errors[key]);
        }

        throw new Error('Submit failed because of errors on server');
      }
    },
    [setError, rawMaterialId],
  );

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
}
