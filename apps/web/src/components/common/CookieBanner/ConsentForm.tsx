import type { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Button } from '../Button';
import { Checkbox } from '../form/Checkbox';
import { CheckboxWrapper } from '../form/CheckboxWrapper';

interface FormState {
  analytics: boolean;
  marketing: boolean;
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
    defaultValues: initialValues ?? { analytics: true, marketing: true },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-5 mt-8">
        <CheckboxWrapper
          childId="functional-cookies"
          title="Funkcionální cookies"
        >
          <Checkbox id="functional-cookies" disabled checked />
        </CheckboxWrapper>

        <div className="h-4 w-[2px] bg-gray-200 mx-2 hidden md:block" />
        <CheckboxWrapper childId="analytics-cookies" title="Analytické cookies">
          <Checkbox id="analytics-cookies" {...register('analytics', {})} />
        </CheckboxWrapper>
        <div className="h-4 w-[2px] bg-gray-200 mx-2 hidden md:block" />
        <CheckboxWrapper
          childId="marketing-cookies"
          title="Marketingové cookies"
        >
          <Checkbox id="marketing-cookies" {...register('marketing', {})} />
        </CheckboxWrapper>
      </div>

      <Button className="mt-7" type="submit">
        Potvrdit
      </Button>
    </form>
  );
};
