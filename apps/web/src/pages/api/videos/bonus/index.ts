import { UserRoles } from '@najit-najist/api';
import { createVideoRequestHandler } from '@najit-najist/api/dist/utils/server/createVideoRequestHandler';
import { AuthService, getLoggedInUser } from '@najit-najist/api/server';
import { NextApiHandler } from 'next';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import path from 'path';
import { PRIVATE_VIDEOS_DIRECTORY_PATH } from '../../../../app/videos/_constants';

const handler: NextApiHandler = async (request, response) => {
  const url = new URL(request.url ?? '', `http://${request.headers.host}`);
  const file =
    url.searchParams.get('type') === 'mp4' ? 'video.min.mp4' : 'video.min.webm';

  const videoPath = path.join(PRIVATE_VIDEOS_DIRECTORY_PATH, 'bonus', file);

  console.log({ videoPath });
  const cookies = new RequestCookies(
    new Headers({ ...request.headers } as any)
  );

  console.log('has cookies');

  await AuthService.authPocketBase({ cookies });
  console.log('Before logged in user');
  const user = await getLoggedInUser({ cookies });
  console.log('before clear auth');
  AuthService.clearAuthPocketBase();

  console.log('before check', {
    role: user.role,
    sdf: UserRoles.NORMAL,
    da: user.role !== UserRoles.NORMAL,
  });
  if (user.role !== UserRoles.NORMAL) {
    return response.status(401);
  }
  console.log('before return');

  return createVideoRequestHandler({
    videoPath,
  })(request, response);
};

export const config = {
  api: {
    responseLimit: false,
  },
};

export default handler;
