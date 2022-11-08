import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { Input } from './form/Input';
import { Textarea } from './form/Textarea';

export const ContactForm: FC = () => {
  const { register } = useForm();

  return (
    <div className="mx-auto max-w-5xl mt-16 px-4 sm:px-0" id="kontakt">
      <div className="mx-auto p-10 sm:p-12 bg-white rounded-xl shadow-xl">
        <h3 className="text-center text-4xl font-semibold font-fancy">
          Kontaktovat nás můžeš už teď
        </h3>
        <hr className="border-none h-2 bg-deep-green-500 max-w-xs mx-auto mt-8" />
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-7 mt-10">
            <Input
              wrapperClassName="w-full"
              label="Jméno"
              placeholder="Tomáš"
              {...register('firstName', {})}
            />
            <Input
              wrapperClassName="w-full"
              label="Příjmení"
              placeholder="Bezlepek"
              {...register('lastName', {})}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-7 mt-4">
            <div className="flex flex-col gap-4">
              <Input
                wrapperClassName="w-full"
                label="Email"
                placeholder="tomas.bezlepek@ukazka.cz"
                {...register('email', {})}
              />
              <Input
                wrapperClassName="w-full"
                label="Telefon"
                placeholder="+420 123456789"
                {...register('telephone', {})}
              />
            </div>
            <Textarea
              wrapperClassName="w-full"
              label="Zpráva"
              rows={4}
              {...register('lastName', {})}
            />
          </div>
          <Button className="mt-12 w-full">Odeslat</Button>
        </div>
      </div>
    </div>
  );
};
