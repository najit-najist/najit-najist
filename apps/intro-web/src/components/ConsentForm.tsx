import type { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from './Button';
import { Input } from './form/Input';

interface FormState {
  analytics: boolean;
}

export type ConsentFormProps = {
  onSubmit: SubmitHandler<FormState>;
  initialValues?: FormState;
};

export const ConsentForm: FC<ConsentFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const form = useForm<FormState>({
    defaultValues: initialValues ?? { analytics: true },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-5 mt-8">
        <Input
          label="Funkconální cookies"
          type="checkbox"
          disabled
          checked
          onChange={() => {}}
        />
        <div className="h-4 w-[2px] bg-gray-200 mx-2 hidden md:block" />
        <Input
          label="Analytické cookies"
          type="checkbox"
          error={errors['analytics']?.message?.toString()}
          {...register('analytics', {})}
        />
      </div>

      <Button className="mt-7" type="submit">
        Potvrdit
      </Button>
    </form>
  );
};
