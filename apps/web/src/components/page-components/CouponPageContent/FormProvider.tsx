'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PropsWithChildren } from 'react';
import { useForm, FormProvider as HookformProvider } from 'react-hook-form';
import { z } from 'zod';

import { createCouponSchema } from './schemas/createCouponSchema';
import { updateCouponSchema } from './schemas/updateCouponSchema';

const updateResolver = zodResolver(updateCouponSchema);
const createResolver = zodResolver(createCouponSchema);
const defaultFormValues: FormValues = {
  reductionPercentage: 0,
  reductionPrice: 0,
  name: '',
  enabled: true,
};

export type FormValues = z.input<typeof createCouponSchema>;

export function FormProvider({
  children,
  initialFormData,
}: PropsWithChildren<{ initialFormData?: FormValues }>) {
  const formMethods = useForm<FormValues>({
    defaultValues: initialFormData ?? defaultFormValues,
    resolver: initialFormData ? updateResolver : createResolver,
  });

  return <HookformProvider {...formMethods}>{children}</HookformProvider>;
}
