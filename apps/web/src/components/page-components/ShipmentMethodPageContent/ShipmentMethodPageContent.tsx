import { PaperHeader } from '@components/common/Paper';
import { Section } from '@components/portal';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import Link from 'next/link';
import { FC } from 'react';

import { Form } from './Form';
import { FormContent } from './FormContent';
import { FormProvider } from './FormProvider';

export const ShipmentMethodPageContent: FC<{
  initialData?: OrderDeliveryMethod;
}> = ({ initialData }) => {
  return (
    <>
      <div className="container my-4">
        <Link
          href="/administrace/doprava"
          className="text-red-400 hover:underline group"
        >
          <ArrowLeftIcon
            strokeWidth={3}
            className="w-4 h-4 inline-block relative -top-0.5 group-hover:-translate-x-1 mr-1 duration-100"
          />
          Zpět na list
        </Link>
      </div>
      <FormProvider
        initialFormData={
          initialData
            ? {
                name: initialData.name,
                notes: initialData.notes,
                price: initialData.price ?? 0,
                description: initialData.description,
              }
            : undefined
        }
      >
        <div className="container mx-auto">
          <Form methodId={initialData?.id}>
            <Section className="!py-3 space-y-3" customSpace>
              <PaperHeader>
                <div className="flex items-end justify-between">
                  <div>{initialData ? 'Upravení dopravy' : 'Nová doprava'}</div>
                </div>
              </PaperHeader>
              <FormContent
                method={initialData ? { id: initialData.id } : undefined}
              />
            </Section>
          </Form>
        </div>
      </FormProvider>
    </>
  );
};
