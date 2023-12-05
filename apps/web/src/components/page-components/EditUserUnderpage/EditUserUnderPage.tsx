'use client';

import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { UserAvatarPicker } from '@components/common/UserAvatarPicker';
import { Section } from '@components/portal';
import { UpdateProfile, User } from '@najit-najist/api';
import {
  Button,
  Checkbox,
  CheckboxWrapper,
  FormBreak,
  Input,
} from '@najit-najist/ui';
import { FC, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

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
}> = ({ userId, viewType, afterProfileImageSlot }) => {
  const { register, formState } = useFormContext<UpdateProfile>();
  const email = useWatch({ name: 'email' });

  const fieldsAreDisabled = formState.isSubmitting;
  const buttonText = viewTypeToButtonText[viewType];

  return (
    <>
      <div className="col-span-2 px-5 sm:px-10 mb-5 md:mb-0 pt-5">
        <UserAvatarPicker userId={userId} />
        {afterProfileImageSlot}
      </div>
      <div className="col-span-4">
        <Section>
          <div className="px-5 sm:px-10">
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

          <div className="px-5 sm:px-10">
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
              <Input
                wrapperClassName="w-full"
                label="Email"
                placeholder="tomas.bezlepek@ukazka.cz"
                required
                disabled={true}
                title="Prozatím nemůžete změnit svůj email"
                value={email}
              />
            </div>
            <div className="mt-5" />
            <FormBreak label="Adresa" />

            <MunicipalitySelect
              className="mt-3"
              label="Obec"
              name="address.municipality"
            />

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
                {formState.isSubmitting
                  ? buttonText.working
                  : buttonText.normal}
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};
