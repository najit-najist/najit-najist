'use client';

import { Button } from '@components/common/Button';
import { Checkbox } from '@components/common/form/Checkbox';
import { CheckboxWrapper } from '@components/common/form/CheckboxWrapper';
import { FormBreak } from '@components/common/form/FormBreak';
import { Input } from '@components/common/form/Input';
import { Section } from '@components/portal';
import { User } from '@najit-najist/database/models';
import { userProfileUpdateInputSchema } from '@server/schemas/userProfileUpdateInputSchema';
import { PasswordInputs } from 'app/registrace/_components/PasswordInputs';
import { FC, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { AddressFields } from './AddressFields';

export type ViewType = 'edit' | 'create' | 'edit-myself';

const viewTypeToButtonText: Record<
  ViewType,
  { normal: string; working: string }
> = {
  create: { normal: 'Vytvořit', working: 'Vytvářím...' },
  edit: { normal: 'Uložit', working: 'Ukládám...' },
  'edit-myself': { normal: 'Uložit', working: 'Ukládám...' },
};

export const EditUserUnderPage: FC<{
  userId?: User['id'];
  viewType: ViewType;
  afterProfileImageSlot?: ReactNode;
}> = ({ viewType, afterProfileImageSlot }) => {
  const { register, formState, control } = useFormContext<
    z.infer<typeof userProfileUpdateInputSchema> & { email: string }
  >();
  const email = useWatch({ name: 'email' });

  const fieldsAreDisabled =
    formState.isSubmitting ||
    (formState.isSubmitSuccessful && viewType === 'create');
  const buttonText = viewTypeToButtonText[viewType];

  return (
    <>
      <Section className="pt-4 !pb-5">
        <div className="px-5">
          <h1 className="text-3xl font-title tracking-wide">
            {viewType == 'create'
              ? 'Nový uživatel'
              : viewType == 'edit'
                ? `Upravit uživatele`
                : viewType == 'edit-myself'
                  ? 'Můj účet'
                  : null}
          </h1>
        </div>

        <div className="px-5">
          <div className="grid gap-4 mt-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                required
                label="Jméno"
                id="firstName"
                type="string"
                autoComplete="given-name"
                error={formState.errors.firstName}
                disabled={fieldsAreDisabled}
                {...register('firstName')}
              />
              <Input
                required
                label="Příjmení"
                id="lastName"
                type="string"
                autoComplete="family-name"
                error={formState.errors.lastName}
                disabled={fieldsAreDisabled}
                {...register('lastName')}
              />
            </div>
            {viewType === 'create' ? (
              <>
                <Input
                  wrapperClassName="w-full"
                  label="Email"
                  placeholder="tomas.bezlepek@ukazka.cz"
                  required
                  disabled={fieldsAreDisabled}
                  error={formState.errors.email}
                  {...register('email')}
                />
                <PasswordInputs disabled={fieldsAreDisabled} />
              </>
            ) : (
              <Input
                wrapperClassName="w-full"
                label="Email"
                placeholder="tomas.bezlepek@ukazka.cz"
                required
                disabled={true}
                title="Prozatím nemůžete změnit svůj email"
                value={email}
              />
            )}
          </div>
          <div className="mt-5" />

          <FormBreak label="Adresa" />

          <div className="grid gap-4 grid-cols-1 mt-5">
            <AddressFields
              disabled={fieldsAreDisabled}
              control={control}
              fieldMap={{
                city: 'address.city',
                country: 'address.city',
                houseNumber: 'address.houseNumber',
                municipality: 'address.municipality',
                postalCode: 'address.postalCode',
                streetName: 'address.streetName',
              }}
            />
          </div>

          <div className="mt-5" />
          <FormBreak className="mb-3" />

          <CheckboxWrapper childId="newsletter" title="Odebírat newsletter">
            <Checkbox
              id="newsletter"
              disabled={fieldsAreDisabled}
              {...register('newsletter')}
            />
          </CheckboxWrapper>

          <div className="pt-5 text-right">
            <Button
              type="submit"
              isLoading={formState.isSubmitting}
              disabled={!Object.keys(formState.dirtyFields).length}
            >
              {formState.isSubmitting ? buttonText.working : buttonText.normal}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};
