import { getLoggedInUser } from '@server/utils/server/getLoggedInUser';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const GET = async (): Promise<NextResponse> => {
  try {
    const currentUser = await getLoggedInUser();

    return NextResponse.json(currentUser, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(null, { status: 401 });
  }
};
