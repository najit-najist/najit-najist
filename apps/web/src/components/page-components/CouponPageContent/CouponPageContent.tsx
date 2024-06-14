import { Section } from '@components/portal';
import { DATETIME_LOCAL_INPUT_FORMAT } from '@constants';
import { CouponWithRelations } from '@custom-types/CouponWithRelations';
import { dayjs } from '@dayjs';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PaperHeader } from '@najit-najist/ui';
import Link from 'next/link';
import { ReactNode } from 'react';

import { EnableSwitch } from './EnableSwitch';
import { Form } from './Form';
import { FormContent } from './FormContent';
import { FormProvider } from './FormProvider';
import { OnlyForProductCategories } from './OnlyForProductCategories';
import { OnlyForProducts } from './OnlyForProducts';

export type CouponPageContentProps = {
  initialCoupon?: CouponWithRelations;
};

export function CouponPageContent({
  initialCoupon,
}: CouponPageContentProps): ReactNode {
  const patch = initialCoupon?.patches[0];

  const onlyForCategories =
    initialCoupon?.onlyForProductCategories.map(({ category }) => category) ??
    [];
  const onlyForProducts =
    initialCoupon?.onlyForProducts.map(({ product }) => product) ?? [];

  return (
    <>
      <div className="container my-4">
        <Link
          href="/administrace/kupony"
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
          initialCoupon
            ? {
                reductionPercentage: patch?.reductionPercentage ?? 0,
                reductionPrice: patch?.reductionPrice ?? 0,
                name: initialCoupon.name,
                enabled: initialCoupon.enabled,
                validFrom: initialCoupon.validFrom
                  ? (dayjs(initialCoupon.validFrom).format(
                      DATETIME_LOCAL_INPUT_FORMAT
                    ) as any)
                  : null,
                validTo: initialCoupon.validTo
                  ? (dayjs(initialCoupon.validTo).format(
                      DATETIME_LOCAL_INPUT_FORMAT
                    ) as any)
                  : null,
                onlyForCategories,
                onlyForProducts,
                minimalProductCount: initialCoupon.minimalProductCount ?? 0,
              }
            : undefined
        }
      >
        <div className="grid grid-cols-12 container mx-auto">
          <div className="col-span-5">
            <Form couponId={initialCoupon?.id}>
              <Section className="!py-3 space-y-3" customSpace>
                <PaperHeader>
                  <div className="flex items-end justify-between">
                    <div>
                      {initialCoupon ? 'Upravení kupónu' : 'Nový kupón'}
                    </div>
                    <EnableSwitch />
                  </div>
                </PaperHeader>
                <FormContent
                  coupon={initialCoupon ? { id: initialCoupon.id } : undefined}
                  couldBeDeleted={
                    !initialCoupon?.patches.some(
                      ({ orders }) => orders.length
                    ) ?? true
                  }
                />
              </Section>
            </Form>
          </div>
          <div className="col-span-7 space-y-3 pl-3">
            <OnlyForProductCategories />
            <OnlyForProducts />
          </div>
        </div>
      </FormProvider>
    </>
  );
}
