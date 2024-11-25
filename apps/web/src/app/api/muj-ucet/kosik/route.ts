import { logger } from '@logger/server';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { getUserCart, type ProductFromCart } from '@utils/getUserCart';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const GET = async (): Promise<NextResponse> => {
  try {
    const session = await getSessionFromCookies();
    const { userId } = session.authContent ?? {};
    const hasUserId = !!userId;
    let searchValue = userId ?? session.cartId;
    let products: ProductFromCart[] = [];

    if (searchValue) {
      const cart = await getUserCart({
        type: hasUserId ? 'user' : 'cart',
        value: searchValue,
      });

      products = cart?.products ?? [];
    }

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    logger.error({ error }, 'Cannot get user cart');

    return NextResponse.json(null, { status: 500 });
  }
};
