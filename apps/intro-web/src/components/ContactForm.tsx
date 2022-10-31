import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { Input } from './form/Input';
import { Textarea } from './form/Textarea';

export const ContactForm: FC = () => {
  const { register } = useForm();

  return (
    <div className="mx-auto max-w-5xl mt-16 px-5 sm:px-0">
      <div className="sm:w-[84%] mx-auto p-5 bg-white rounded-xl ">
        <h3 className="text-center text-4xl font-semibold">
          Kontaktovat nás můžeš už teď
        </h3>
        <div className="grid sm:grid-cols-2 gap-7">
          <Input
            wrapperClassName="w-full"
            label="Jméno"
            {...register('firstName', {})}
          />
          <Input
            wrapperClassName="w-full"
            label="Příjmení"
            {...register('lastName', {})}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-7 mt-4">
          <div className="flex flex-col gap-4">
            <Input
              wrapperClassName="w-full"
              label="Jméno"
              {...register('firstName', {})}
            />
            <Input
              wrapperClassName="w-full"
              label="Příjmení"
              {...register('lastName', {})}
            />
          </div>
          <Textarea
            wrapperClassName="w-full"
            label="Příjmení"
            rows={4}
            {...register('lastName', {})}
          />
        </div>
        <Button className="mt-7 w-full">setnd</Button>
      </div>
    </div>
  );
};
