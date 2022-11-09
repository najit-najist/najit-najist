import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '../lib/trpc';
import { Button } from './Button';
import { ContextProviders } from './ContextProviders';
import { Input } from './form/Input';
import { Textarea } from './form/Textarea';
import { contactUsSchema } from '@najit-najist/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const ContactFormBase: FC = () => {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof contactUsSchema>
  >({
    resolver: zodResolver(contactUsSchema),
  });
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const { error, mutateAsync: mutate } = trpc.useMutation('contact-us.send');

  const onSubmit = handleSubmit(async (values) => {
    await mutate(values);
  });

  return (
    <div className="mx-auto max-w-5xl mt-16 px-4 sm:px-0" id="kontakt">
      <div className="mx-auto p-10 sm:p-12 bg-white rounded-xl shadow-xl relative">
        <h3 className="text-center text-4xl font-semibold font-fancy">
          Kontaktovat nás můžeš už teď
        </h3>
        <hr className="border-none h-2 bg-deep-green-500 max-w-xs mx-auto mt-8" />
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-7 mt-10">
            <Input
              required
              wrapperClassName="w-full"
              label="Jméno"
              placeholder="Tomáš"
              error={errors['firstName']?.message?.toString()}
              {...register('firstName', {})}
            />
            <Input
              required
              wrapperClassName="w-full"
              label="Příjmení"
              placeholder="Bezlepek"
              error={errors['lastName']?.message?.toString()}
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
                error={errors['email']?.message?.toString()}
                {...register('email', {})}
              />
              <Input
                wrapperClassName="w-full"
                label="Telefon"
                placeholder="+420 123456789"
                error={errors['telephone']?.message?.toString()}
                {...register('telephone', {})}
              />
            </div>
            <Textarea
              wrapperClassName="w-full"
              label="Zpráva"
              rows={4}
              error={errors['message']?.message?.toString()}
              {...register('message', {})}
            />
          </div>
          <Button className="mt-12 w-full" disabled={isSubmitSuccessful}>
            {isSubmitting ? 'Odesílám...' : 'Odeslat'}
          </Button>
          {error ? (
            <div className="text-center text-red-600 font-bold font-xl">
              Ajaj... stala se chyba při odesílání. Zkuste to znovy za chvíli
            </div>
          ) : (
            ''
          )}
        </form>
        {isSubmitSuccessful && (
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-white px-10">
            <h3 className="text-center text-4xl font-semibold font-fancy leading-loose">
              Děkujeme za Váš zájem. <br /> Zanedlouho Vás budeme kontaktovat.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export const ContactForm: FC = () => (
  <ContextProviders>
    <ContactFormBase />
  </ContextProviders>
);
