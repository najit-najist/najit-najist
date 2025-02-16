import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { Price } from '@components/common/Price';
import { UserService } from '@server/services/UserService';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { getUserCart } from '@utils/getUserCart';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import { cookies as getCookies } from 'next/headers';
import Link from 'next/link';
import { FC } from 'react';

import { CartItem } from './CartItem/CartItem';
import { WithBlurOnTransition } from './WithBlurOnTransition';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Košík',
};

const EmptyCart: FC = () => {
  return (
    <div className="text-center flex flex-col items-center my-20 justify-center">
      <PageTitle>Zatím nic v košíku...</PageTitle>
      <Link href="/produkty" className={buttonStyles({ className: 'mt-5' })}>
        Jít nakupovat!
      </Link>
    </div>
  );
};

// TODO: this page should be behind dynamic page - each cart should have its own subpage. that way it will be faster for user
export default async function Page() {
  const cookies = await getCookies();
  const session = await getSessionFromCookies({ cookies });

  const loggedInUser = session.authContent?.userId
    ? await UserService.getOneBy('id', session.authContent?.userId)
    : null;
  const cart = await getUserCart({
    type: loggedInUser ? 'user' : 'cart',
    value: Number(loggedInUser?.id ?? session.cartId ?? '0'),
  });

  if (!cart?.products.length) {
    return <EmptyCart />;
  }

  return (
    <>
      <div className="container mt-5 sm:-mb-5">
        <GoBackButton href="/produkty" text="Zpět na nákup" />
      </div>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
        </div>
      </PageHeader>
      <section className="bg-white pt-5 pb-10">
        <ul role="list" className="divide-y container">
          {cart.products.map((cartItem) => (
            <CartItem key={cartItem.id} data={cartItem} />
          ))}
        </ul>
        <div className="border-t-2 border-dashed">
          <div className="container pt-3">
            <div className="flex items-center justify-between font-semibold text-gray-900">
              <span>Celkově za produkty</span>
              <WithBlurOnTransition>
                <Price
                  size="default"
                  value={orderGetTotalPrice({
                    deliveryMethodPrice: 0,
                    paymentMethodPrice: 0,
                    subtotal: cart.subtotal,
                    discount: cart.discount,
                  })}
                  discount={cart.discount}
                />
              </WithBlurOnTransition>
            </div>
            <Link
              className={buttonStyles({
                className: 'ml-auto sm:w-48 text-center mt-3',
              })}
              href="/muj-ucet/kosik/pokladna"
            >
              Objednat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
