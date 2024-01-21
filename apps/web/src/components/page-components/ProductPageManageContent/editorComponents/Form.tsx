'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Product,
  createProductSchema,
  updateProductSchema,
} from '@najit-najist/api';
import { toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const Form: FC<
  PropsWithChildren<{ viewType: 'create' | 'edit'; product?: Product }>
> = ({ children, viewType, product }) => {
  const router = useRouter();
  const formMethods = useForm<ProductFormData>({
    defaultValues: {
      images: [],
      stock: null,
      price: {
        value: 0,
      },
      onlyDeliveryMethods: [],
      ...product,
    },
    resolver: zodResolver(
      viewType === 'edit' ? updateProductSchema : createProductSchema
    ),
  });
  const { handleSubmit } = formMethods;
  const { mutateAsync: updateProduct } = trpc.products.update.useMutation();
  const { mutateAsync: createProduct } = trpc.products.create.useMutation();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      const publishedAt =
        values.publishedAt instanceof Date
          ? values.publishedAt.toString()
          : values.publishedAt;

      if (viewType === 'edit') {
        const { id } = product!;
        const updateProductPromise = updateProduct({
          id,
          payload: {
            name: values.name,
            description: values.description,
            images: values.images,
            price: values.price,
            stock: values.stock,
            publishedAt,
            category: values.category,
            onlyDeliveryMethods: values.onlyDeliveryMethods,
          },
        });

        toast.promise(updateProductPromise, {
          loading: 'Ukládám úpravy',
          success: <b>Produkt upraven!</b>,
          error: (error) => <b>Nemohli uložit úpravy. {error.message}</b>,
        });

        const result = await updateProductPromise;

        router.push(`/produkty/${result.slug}?editor=true`);
      } else if (viewType === 'create') {
        const createProductPromise = createProduct({
          name: values.name,
          description: values.description,
          images: values.images,
          price: values.price,
          stock: values.stock,
          publishedAt,
          category: values.category,
          onlyDeliveryMethods: values.onlyDeliveryMethods,
        });

        toast.promise(createProductPromise, {
          loading: 'Vytvářím produkt',
          success: <b>Produkt vytvořen!</b>,
          error: (error) => <b>Nemohli produkt vytvořit. {error.message}</b>,
        });

        const data = await createProductPromise;

        router.push(`/produkty/${data.slug}`);
      }
    },
    [createProduct, router, updateProduct, viewType, product]
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
