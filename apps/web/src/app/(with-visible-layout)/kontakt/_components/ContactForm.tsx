'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGtag } from '@hooks';
import { contactUsSchema } from '@najit-najist/api';
import { Alert, Button, Input, Textarea } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const ContactForm: FC = () => {
  const formMethods = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
  });
  const { trackEvent } = useGtag();
  const { formState, register, handleSubmit, setError } = formMethods;
  const { mutateAsync: sendContents } = trpc.contactSend.useMutation({
    onError() {
      setError('root', {
        message: 'Stala se chyba při odesílání. Zkuste to znovu za chvíli',
      });
    },
  });

  const onSubmit: Parameters<typeof handleSubmit>['0'] = async (values) => {
    await sendContents(values);
    trackEvent('contact_send');
  };

  return (
    <div className="max-w-4xl">
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
        className="bg-white rounded-lg p-5 relative overflow-hidden"
      >
        <div className="grid sm:grid-cols-2 gap-7">
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
        </div>
        <div className="grid sm:grid-cols-2 gap-7 mt-4">
          <div className="flex flex-col gap-4">
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
            label="Zpráva"
            rows={4}
            error={formState.errors.message}
            {...register('message', {})}
          />
        </div>
        <Button
          className="mt-12 w-full"
          type="submit"
          disabled={formState.isSubmitSuccessful}
          isLoading={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Odesílám...' : 'Odeslat'}
        </Button>
        {formState.errors.root ? (
          <div className="text-center text-red-600 font-bold font-xl">
            {formState.errors.root.message} Ajaj... stala se chyba při
            odesílání. Zkuste to znovy za chvíli
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
