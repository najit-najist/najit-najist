'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Product,
  createProductSchema,
  updateProductSchema,
} from '@najit-najist/api';
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
      categories: [],
      images: [],
      // TODO: implement stock
      stock: {
        count: 0,
      },
      price: {
        value: 0,
      },
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

        await updateProduct({
          id,
          payload: {
            name: values.name,
            description: values.description,
            images: values.images,
            price: values.price,
            stock: values.stock,
            publishedAt,
            // TODO: categories
          },
        });

        router.refresh();
      } else if (viewType === 'create') {
        const data = await createProduct({
          name: values.name,
          description: values.description,
          images: values.images,
          price: values.price,
          stock: values.stock,
          publishedAt,
          // TODO: categories
        });

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
