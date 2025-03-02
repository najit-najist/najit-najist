'use client';

import { ProductWithRelationsLocal } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderDeliveryMethodsSlug } from '@najit-najist/database/models';
import { productCreateInputSchema } from '@server/schemas/productCreateInputSchema';
import { productUpdateInputSchema } from '@server/schemas/productUpdateInputSchema';
import { handlePromiseForToast } from '@utils/handleActionForToast';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ProductFormData } from '../_types';
import { createProductAction } from '../actions/createProductAction';
import { updateProductAction } from '../actions/updateProductAction';

export const Form: FC<
  PropsWithChildren<{
    viewType: 'create' | 'edit';
    product?: ProductWithRelationsLocal;
  }>
> = ({ children, viewType, product }) => {
  const formMethods = useForm<ProductFormData>({
    defaultValues: {
      ...product,
      price: product?.price ?? 0,
      stock: product?.stock ?? undefined,
      images: product?.images.map(({ file }) => file),
      category: product?.category ?? undefined,
      weight: product?.weight ?? 0,
      composedOf: product?.composedOf ?? [],
      alergens: product?.alergens ?? [],
      manufacturer: product?.manufacturer ?? null,
      toDeliveryMethods: product?.limitedToDeliveryMethods.reduce<
        Partial<Record<OrderDeliveryMethodsSlug, boolean>>
      >((result, iteration) => {
        result[iteration.deliveryMethod.slug] = true;
        return result;
      }, {}),
    },
    resolver: zodResolver(
      viewType === 'edit' ? productUpdateInputSchema : productCreateInputSchema,
    ),
  });
  const { handleSubmit } = formMethods;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      const publishedAt =
        values.publishedAt instanceof Date
          ? values.publishedAt.toString()
          : values.publishedAt;

      if (viewType === 'edit') {
        const { id } = product!;
        const updateProductPromise = updateProductAction({
          id,
          payload: {
            name: values.name,
            description: values.description,
            images: values.images,
            price: values.price,
            stock: values.stock,
            publishedAt,
            category: values.category,
            toDeliveryMethods: values.toDeliveryMethods,
            weight: values.weight,
            composedOf: values.composedOf,
            alergens: values.alergens,
            manufacturer: values.manufacturer,
          },
        });

        toast.promise(handlePromiseForToast(updateProductPromise), {
          loading: 'Ukládám úpravy',
          success: <b>Produkt upraven!</b>,
          error: (error) => <b>Nemohli se uložit úpravy. {error.message}</b>,
        });

        await updateProductPromise;
      } else if (viewType === 'create') {
        const createProductPromise = createProductAction({
          name: values.name,
          description: values.description,
          images: values.images,
          price: values.price,
          stock: values.stock,
          publishedAt,
          category: values.category,
          toDeliveryMethods: values.toDeliveryMethods,
          weight: values.weight,
          composedOf: values.composedOf,
          alergens: values.alergens,
          manufacturer: values.manufacturer,
        });

        toast.promise(handlePromiseForToast(createProductPromise), {
          loading: 'Vytvářím produkt',
          success: <b>Produkt vytvořen!</b>,
          error: (error) => <b>Nemohli produkt vytvořit. {error.message}</b>,
        });

        await createProductPromise;
      }
    },
    [viewType, product],
  );

  const errorsAsArray = Object.entries(formMethods.formState.errors ?? {});
  if (errorsAsArray.length) {
    console.log('Handling errors in form', { errorsAsArray });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
