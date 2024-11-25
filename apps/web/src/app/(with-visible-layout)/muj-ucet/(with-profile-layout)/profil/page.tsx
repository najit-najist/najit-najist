import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Section } from '@components/portal';
import { getAuthorizedUserOrRequestLogin } from '@server/utils/getAuthorizedUserOrRequestLogin';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import Link from 'next/link';

import { OrderPreviewItem } from '../_components/OrderPreviewItem';

const MAX_NUMBER_OF_ORDERS = 6;
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  const user = await getAuthorizedUserOrRequestLogin();
  const latestOrders = await getCachedOrders({
    user: { id: [user.id] },
    perPage: MAX_NUMBER_OF_ORDERS + 1,
  });

  return (
    <div className="space-y-5">
      <Section>
        <div className="px-5 flex justify-between items-center">
          <h1 className="text-2xl font-title tracking-wide">
            Vítejte, {user.firstName} {user.lastName}!
          </h1>

          <Link
            href="/logout"
            className="text-red-500 hover:underline font-medium text-lg"
          >
            Odhlásit se
          </Link>
        </div>
      </Section>
      <Section>
        <div className="px-5 flex items-center">
          <h1 className="text-2xl font-title tracking-wide">Moje objednávky</h1>

          <Link
            href="/eshop"
            className={buttonStyles({
              asLink: true,
              className: 'ml-auto',
              appearance: 'small',
            })}
          >
            Jít nakupovat
          </Link>
        </div>

        <div className="px-5 flex flex-col">
          <ul role="list" className="divide-y divide-gray-100">
            {latestOrders.items.slice(0, MAX_NUMBER_OF_ORDERS).map((order) => (
              <OrderPreviewItem key={order.id} order={order} />
            ))}
          </ul>

          {latestOrders.items.length === MAX_NUMBER_OF_ORDERS + 1 ? (
            <Link
              href="/muj-profil/objednavky"
              className="text-project-primary hover:underline text-sm ml-auto block"
            >
              Zobrazit starší objednávky
            </Link>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
