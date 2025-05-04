'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { PropsWithChildren } from 'react';
import { useForm, FormProvider as HookformProvider } from 'react-hook-form';
import { z } from 'zod';

import { createProductRawMaterialSchema } from './schemas/createProductRawMaterialSchema';
import { updateProductRawMaterialSchema } from './schemas/updateProductRawMaterialSchema';

const updateResolver = zodResolver(updateProductRawMaterialSchema);
const createResolver = zodResolver(createProductRawMaterialSchema);
const defaultFormValues: FormValues = {
  name: '',
};

export type FormValues = z.input<typeof createProductRawMaterialSchema>;

export function FormProvider({
  children,
  initialFormData,
}: PropsWithChildren<{ initialFormData?: FormValues }>) {
  const formMethods = useForm<FormValues>({
    defaultValues: initialFormData ?? defaultFormValues,
    resolver: initialFormData ? updateResolver : createResolver,
  });

  return (
    <HookformProvider {...formMethods}>
      {children as React.JSX.Element}
    </HookformProvider>
  );
}
