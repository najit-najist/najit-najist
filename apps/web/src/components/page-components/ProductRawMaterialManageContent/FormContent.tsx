'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/form/Input';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ProductRawMaterial } from '@najit-najist/database/models';
import { useMutation } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues } from './FormProvider';
import { deleteProductRawMaterialAction } from './actions/deleteProductRawMaterialAction';

export function FormContent({
  rawMaterial,
}: {
  rawMaterial?: { id: ProductRawMaterial['id'] };
}): ReactNode {
  const { formState, register } = useFormContext<FormValues>();
  const isRedirectingAfterCreate =
    !rawMaterial?.id && formState.isSubmitSuccessful;
  const {
    mutate: deleteMaterial,
    isPending: isDeleting,
    data,
  } = useMutation({
    mutationFn: deleteProductRawMaterialAction,
  });

  const fieldsAreDisabled =
    formState.isSubmitting || isRedirectingAfterCreate || isDeleting;

  return (
    <>
      <div className="px-3 space-y-2 pt-2">
        <Input
          required
          label="Název"
          id="name"
          type="string"
          autoComplete="off"
          error={formState.errors.name}
          disabled={fieldsAreDisabled}
          {...register('name')}
        />
      </div>
      <div className="px-3">
        {isRedirectingAfterCreate ? (
          <Alert
            className="mt-3"
            icon={ArrowPathIcon}
            iconClassName="animate-spin"
            heading="Surovina vytvořena. Přecházím na stránku suroviny..."
          />
        ) : null}
        <div className="flex flex-wrap mt-3">
          <Button type="submit" isLoading={fieldsAreDisabled}>
            Uložit
          </Button>
          {rawMaterial ? (
            <Button
              color="red"
              className="!px-1 py-1 ml-auto w-10 h-10"
              disabled={fieldsAreDisabled}
              onClick={() => deleteMaterial(rawMaterial)}
              isLoading={isDeleting || data !== undefined}
            >
              <TrashIcon className="w-6 h-6 relative" />
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}
