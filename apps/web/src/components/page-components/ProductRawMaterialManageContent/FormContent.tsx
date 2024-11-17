'use client';

import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ProductRawMaterial } from '@najit-najist/database/models';
import { Alert, Button, Input } from '@najit-najist/ui';
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
              appearance="spaceless"
              color="red"
              className="px-2 py-1 ml-auto"
              disabled={fieldsAreDisabled}
              onClick={() => deleteMaterial(rawMaterial)}
              isLoading={isDeleting || data !== undefined}
            >
              <TrashIcon className="w-6 h-6 top-0.5 relative" />
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}
