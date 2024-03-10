import { getLoggedInUser } from '@najit-najist/api/server';
import { NextResponse } from 'next/server';

export const GET = async (): Promise<NextResponse> => {
  try {
    const currentUser = await getLoggedInUser();
    console.log({ currentUser });

    return NextResponse.json(currentUser, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(null, { status: 401 });
  }
};
