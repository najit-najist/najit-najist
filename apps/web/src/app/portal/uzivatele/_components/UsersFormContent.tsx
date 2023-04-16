import { User } from '@najit-najist/api';
import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

export const UsersFormContent: FC = () => {
  const { register, formState } = useFormContext<User>();
  const { errors } = formState;

  const fieldsAreDisabled = formState.isSubmitting;

  return (
    <div className="grid gap-4 mt-5">
      <div className="grid grid-cols-2 gap-4">
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
        disabled={fieldsAreDisabled}
        {...register('email', {})}
      />
    </div>
  );
};
