import { createVideoRequestHandler } from '@najit-najist/api/dist/utils/server/createVideoRequestHandler';
import { NextApiHandler } from 'next';
import path from 'path';
import { PRIVATE_VIDEOS_DIRECTORY_PATH } from '../../../../app/videos/_constants';

const handler: NextApiHandler = (request, response) => {
  const url = new URL(request.url ?? '', `http://${request.headers.host}`);
  const file =
    url.searchParams.get('type') === 'mp4' ? 'video.min.mp4' : 'video.webm';

  return createVideoRequestHandler({
    videoPath: path.join(PRIVATE_VIDEOS_DIRECTORY_PATH, 'our-story', file),
  })(request, response);
};

export const config = {
  api: {
    responseLimit: false,
  },
};

export default handler;
