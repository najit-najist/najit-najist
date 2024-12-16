import { Badge } from '@components/common/Badge';
import { Paper, PaperHeader } from '@components/common/Paper';
import { Skeleton } from '@components/common/Skeleton';
import { Section } from '@components/portal';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { database } from '@najit-najist/database';
import { ProductRawMaterial } from '@najit-najist/database/models';
import Link from 'next/link';
import { Suspense } from 'react';

import { Form } from './Form';
import { FormContent } from './FormContent';
import { FormProvider } from './FormProvider';

export type ProductRawMaterialManageContentProps = {
  initialMaterial?: ProductRawMaterial;
};

async function UsedInProducts({ material }: { material: ProductRawMaterial }) {
  const products = await database.query.productRawMaterialsToProducts.findMany({
    where: (schema, { eq }) => eq(schema.rawMaterialId, material.id),
    with: {
      product: {
        with: {
          images: true,
          category: true,
        },
      },
    },
  });

  return (
    <>
      <PaperHeader className="mt-4">Využito v produktech: </PaperHeader>
      <div className="flex flex-col gap-3">
        {products.map(({ product }) => (
          <Link href={`/produkty/${encodeURIComponent(product.slug)}`}>
            <Paper key={product.id} className="p-4">
              {product.name}{' '}
              <Badge color="blue">{product.category?.name}</Badge>
            </Paper>
          </Link>
        ))}
        {!products.length ? (
          <p className="text-gray-500 mt-5">
            Zatím nevyužito v žádném produktu
          </p>
        ) : null}
      </div>
    </>
  );
}

export function ProductRawMaterialManageContent({
  initialMaterial,
}: ProductRawMaterialManageContentProps) {
  return (
    <>
      <div className="container my-4">
        <Link
          href="/administrace/suroviny"
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
          initialMaterial
            ? {
                name: initialMaterial?.name ?? '',
              }
            : undefined
        }
      >
        <div className="container mx-auto">
          <div className="col-span-5">
            <Form rawMaterialId={initialMaterial?.id}>
              <Section className="!py-3 space-y-3" customSpace>
                <PaperHeader>
                  <div className="flex items-end justify-between">
                    <div>
                      {initialMaterial ? 'Upravení suroviny' : 'Nová surovina'}
                    </div>
                    {/* <EnableSwitch /> */}
                  </div>
                </PaperHeader>
                <FormContent
                  rawMaterial={
                    initialMaterial ? { id: initialMaterial.id } : undefined
                  }
                />
              </Section>
            </Form>
          </div>
          {initialMaterial ? (
            <div className="space-y-3">
              <Suspense fallback={<Skeleton className="w-full h-32" />}>
                <UsedInProducts material={initialMaterial} />
              </Suspense>
            </div>
          ) : null}
        </div>
      </FormProvider>
    </>
  );
}
