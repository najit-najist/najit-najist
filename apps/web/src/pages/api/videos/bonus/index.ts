import { UserRoles } from '@najit-najist/database/models';
import { createVideoRequestHandler } from '@server/utils/server/createVideoRequestHandler';
import { getLoggedInUser } from '@server/utils/server/getLoggedInUser';
import { NextApiHandler } from 'next';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import path from 'path';

import { SHARED_STATIC_FILES_DIRECTORY_PATH } from '../../../../app/videos/_constants';

const handler: NextApiHandler = async (request, response) => {
  const url = new URL(request.url ?? '', `http://${request.headers.host}`);
  const file =
    url.searchParams.get('type') === 'mp4' ? 'video.min.mp4' : 'video.min.webm';

  const videoPath = path.join(
    SHARED_STATIC_FILES_DIRECTORY_PATH,
    'videos',
    'bonus',
    file
  );

  const cookies = new RequestCookies(
    new Headers({ ...request.headers } as any)
  );

  const user = await getLoggedInUser({ cookies });

  if (user.role !== UserRoles.NORMAL && user.role !== UserRoles.ADMIN) {
    return response.status(401);
  }

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
