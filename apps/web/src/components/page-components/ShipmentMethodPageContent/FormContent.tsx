'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/form/Input';
import { Textarea } from '@components/common/form/Textarea';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues } from './FormProvider';

export function FormContent({
  method,
}: {
  method?: { id: OrderDeliveryMethod['id'] };
}): ReactNode {
  const { formState, register } = useFormContext<FormValues>();
  const isRedirectingAfterCreate = !method?.id && formState.isSubmitSuccessful;
  const fieldsAreDisabled = formState.isSubmitting || isRedirectingAfterCreate;

  return (
    <>
      <div className="px-3 space-y-4 pt-2">
        <div className="sm:grid grid-cols-2 gap-5">
          <Input
            required
            disabled
            label="Název"
            id="name"
            type="string"
            autoComplete="off"
            error={formState.errors.name}
            {...register('name')}
          />
          <Input
            required
            type="number"
            label="Cena (Kč)"
            autoComplete="off"
            error={formState.errors.price}
            {...register('price', { valueAsNumber: true })}
          />
        </div>
        <Textarea
          required
          label="Popisek"
          autoComplete="off"
          error={formState.errors.description}
          disabled={fieldsAreDisabled}
          {...register('description')}
        />
        <Textarea
          required
          label="Poznámky pro uživatele"
          autoComplete="off"
          error={formState.errors.notes}
          disabled={fieldsAreDisabled}
          {...register('notes')}
        />
      </div>
      <div className="px-3">
        {isRedirectingAfterCreate ? (
          <Alert
            className="mt-3"
            icon={ArrowPathIcon}
            iconClassName="animate-spin"
            heading="Doprava vytvořena. Přecházím na stránku dopravy..."
          />
        ) : null}
        <div className="flex flex-wrap mt-3">
          <Button type="submit" isLoading={fieldsAreDisabled}>
            Uložit
          </Button>
        </div>
      </div>
    </>
  );
}
