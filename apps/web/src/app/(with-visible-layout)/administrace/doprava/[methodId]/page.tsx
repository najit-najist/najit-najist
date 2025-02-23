import { ShipmentMethodPageContent } from '@components/page-components/ShipmentMethodPageContent';
import { database } from '@najit-najist/database';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ methodId: string }> };

export default async function Page({ params }: Params) {
  const { methodId } = await params;
  const method = await database.query.orderDeliveryMethods.findFirst({
    where: (s, { eq }) => eq(s.id, Number(methodId)),
  });

  if (!method) {
    notFound();
  }

  return <ShipmentMethodPageContent initialData={method} />;
}
