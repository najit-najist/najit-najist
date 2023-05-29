import { Section } from '@components/portal';
import { UserAvatarPicker } from '@components/common/UserAvatarPicker';
import { FC, FormEventHandler } from 'react';
import { Button, Input } from '@najit-najist/ui';
import { useFormContext } from 'react-hook-form';
import { User } from '@najit-najist/api';

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
  onSubmit: FormEventHandler<HTMLFormElement>;
  userId?: User['id'];
  viewType: ViewType;
}> = ({ onSubmit, userId, viewType }) => {
  const { register, formState } = useFormContext<User>();
  const { errors } = formState;

  const fieldsAreDisabled = formState.isSubmitting;
  const buttonText = viewTypeToButtonText[viewType];

  return (
    <form
      className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5"
      onSubmit={onSubmit}
    >
      <div className="col-span-2 px-10 mb-5 md:mb-0 pt-5">
        <UserAvatarPicker userId={userId} />
      </div>
      <div className="col-span-4">
        <Section>
          <div className="px-10">
            <h1 className="text-2xl">
              {viewType == 'create'
                ? 'Nový uživatel'
                : viewType == 'edit'
                ? `Upravit uživatele`
                : viewType == 'edit-myself'
                ? 'Můj účet'
                : null}
            </h1>
          </div>

          <div className="px-10">
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
                error={errors['email']}
                disabled={true}
                title="Prozatím nemůžete změnit svůj email"
                {...register('email', {})}
              />
            </div>
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
    </form>
  );
};
