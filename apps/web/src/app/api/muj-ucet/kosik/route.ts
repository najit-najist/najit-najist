import { UserNotAuthorizedError } from '@server/errors/UserNotAuthorizedError';
import { logger } from '@server/logger';
import { getLoggedInUserId } from '@server/utils/server';
import { getUserCart } from '@utils/getUserCart';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const GET = async (): Promise<NextResponse> => {
  try {
    const currentUserId = await getLoggedInUserId();
    const cart = await getUserCart({ id: currentUserId });

    return NextResponse.json(cart?.products ?? [], {
      status: 200,
    });
  } catch (error) {
    if (error instanceof UserNotAuthorizedError === false) {
      logger.error({ error }, 'Cannot get user cart');
    }

    return NextResponse.json(null, { status: 401 });
  }
};
