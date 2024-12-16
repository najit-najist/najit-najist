'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/form/Input';
import { Textarea } from '@components/common/form/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks/usePlausible';
import { contactUsInputSchema } from '@server/schemas/contactUsInputSchema';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { contactUsAction } from '../contactUsAction';

type FormValues = z.infer<typeof contactUsInputSchema>;

export const ContactForm: FC<{ defaultValues?: Partial<FormValues> }> = ({
  defaultValues,
}) => {
  const formMethods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(contactUsInputSchema),
  });
  const { trackEvent } = usePlausible();
  const { formState, register, handleSubmit, setError } = formMethods;

  const onSubmit: Parameters<typeof handleSubmit>['0'] = async (values) => {
    const response = await contactUsAction(values);
    trackEvent('Contact form send');

    if ('errors' in response) {
      const { errors = {} } = response;

      for (const [fieldName, error] of Object.entries(errors)) {
        setError(fieldName as any, {
          message: error.message,
        });
      }
    }
  };

  return (
    <div>
      {formState.errors.root ? (
        <Alert
          heading="Chyba při odesílání"
          className="text-center text-red-600 font-bold font-xl mb-5"
          color="error"
        >
          {formState.errors.root.message}
        </Alert>
      ) : null}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-project p-5 relative overflow-hidden shadow-xl"
      >
        <div className="grid sm:grid-cols-2 gap-7">
          <div className="flex flex-col gap-3">
            <Input
              required
              wrapperClassName="w-full"
              label="Jméno"
              placeholder="Tomáš"
              error={formState.errors.firstName}
              {...register('firstName', {})}
            />
            <Input
              required
              wrapperClassName="w-full"
              label="Příjmení"
              placeholder="Bezlepek"
              error={formState.errors.lastName}
              {...register('lastName', {})}
            />
            <Input
              wrapperClassName="w-full"
              label="Email"
              placeholder="tomas.bezlepek@ukazka.cz"
              required
              error={formState.errors.email}
              {...register('email', {})}
            />
            <Input
              wrapperClassName="w-full"
              label="Telefon"
              placeholder="+420 123456789"
              error={formState.errors.telephone}
              {...register('telephone', {})}
            />
          </div>
          <Textarea
            wrapperClassName="w-full"
            className="min-h-52"
            label="Zpráva"
            rows={4}
            error={formState.errors.message}
            {...register('message', {})}
          />
        </div>
        <Button
          className="mt-6 w-full sm:max-w-52"
          type="submit"
          disabled={formState.isSubmitSuccessful}
          isLoading={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Odesílám...' : 'Odeslat'}
        </Button>
        {formState.errors.root ? (
          <div className="text-center text-red-600 font-bold font-xl">
            {formState.errors.root.message ??
              'Ajaj... stala se chyba při odesílání. Zkuste to znovy za chvíli'}
          </div>
        ) : null}
        {formState.isSubmitSuccessful && (
          <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center bg-white px-10">
            <h3 className="text-center text-4xl font-semibold leading-relaxed">
              Děkujeme za Váš zájem. <br /> Zanedlouho Vás budeme kontaktovat.
            </h3>
          </div>
        )}
      </form>
    </div>
  );
};
