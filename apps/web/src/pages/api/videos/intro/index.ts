import { createVideoRequestHandler } from '@server/utils/server/createVideoRequestHandler';
import { NextApiHandler } from 'next';
import path from 'path';

import { SHARED_STATIC_FILES_DIRECTORY_PATH } from '../../../../app/videos/_constants';

const handler: NextApiHandler = (request, response) => {
  const url = new URL(request.url ?? '', `http://${request.headers.host}`);
  const file =
    url.searchParams.get('type') === 'mp4' ? 'video.min.mp4' : 'video.min.webm';

  return createVideoRequestHandler({
    videoPath: path.join(
      SHARED_STATIC_FILES_DIRECTORY_PATH,
      'videos',
      'intro',
      file
    ),
  })(request, response);
};

export const config = {
  api: {
    responseLimit: false,
  },
};

export default handler;
