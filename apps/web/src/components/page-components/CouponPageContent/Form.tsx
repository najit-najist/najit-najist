'use client';

import { PropsWithChildren, useCallback } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';

import { FormValues } from './FormProvider';
import { createCouponAction } from './actions/createCouponAction';
import { updateCouponAction } from './actions/updateCouponAction';

export function Form({
  couponId,
  children,
}: PropsWithChildren<{
  couponId?: number;
}>) {
  const { setError, handleSubmit } = useFormContext<FormValues>();

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      const response =
        (await (couponId
          ? updateCouponAction({ id: couponId!, values })
          : createCouponAction(values))) ?? {};

      if ('errors' in response) {
        for (const key in response.errors) {
          setError(key as any, response.errors[key]);
        }

        throw new Error('Submit failed because of errors on server');
      }
    },
    [setError, couponId]
  );

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
}
