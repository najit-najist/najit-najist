import { ProductRawMaterialManageContent } from '@components/page-components/ProductRawMaterialManageContent';
import { database } from '@najit-najist/database';
import { notFound } from 'next/navigation';

type Params = { params: { materialId: string } };

export default async function Page({ params }: Params) {
  const material = await database.query.productRawMaterials.findFirst({
    where: (s, { eq }) => eq(s.id, Number(params.materialId)),
  });

  if (!material) {
    notFound();
  }

  return <ProductRawMaterialManageContent initialMaterial={material} />;
}
