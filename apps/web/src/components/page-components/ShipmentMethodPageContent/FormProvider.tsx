'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { PropsWithChildren } from 'react';
import { useForm, FormProvider as HookformProvider } from 'react-hook-form';
import { z } from 'zod';

import { createShipmentMethodSchema } from './schemas/createShipmentMethodSchema';
import { updateShipmentMethodSchema } from './schemas/updateShipmentMethodSchema';

const updateResolver = zodResolver(updateShipmentMethodSchema);
const createResolver = zodResolver(createShipmentMethodSchema);
const defaultFormValues: FormValues = {
  price: 0,
  description: '',
  notes: '',
};

export type FormValues = z.input<typeof createShipmentMethodSchema>;

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
