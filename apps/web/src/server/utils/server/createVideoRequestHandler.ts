import fs from 'fs-extra';
import { lookup } from 'mime-types';
import { NextApiHandler } from 'next';

export interface CreateVideoRequestHandlerOptions {
  /**
   * Absolute video path - will be checked upon creating
   */
  videoPath: string;
}

const MAX_CHUNK_SIZE = 10 ** 6;

// TODO: rewrite this to Node@16 ReadableStream
export const createVideoRequestHandler = ({
  videoPath,
}: CreateVideoRequestHandlerOptions): NextApiHandler => {
  if (fs.pathExistsSync(videoPath) === false) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `File under absolute path "${videoPath}" to handle does not exist`,
      );
    }

    return (request, response) => response;
  }

  const stats = fs.statSync(videoPath);
  const mimeType = lookup(videoPath);

  return async (request, response) => {
    const { range } = request.headers;

    if (!range) {
      return response.status(400).send('Include Range Header');
    }
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + MAX_CHUNK_SIZE, stats.size - 1);

    const stream = fs.createReadStream(videoPath, { start, end });
    const headers = {
      //'Content-Disposition': `attachment; filename="${filename}"`,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      'Content-Length': end - start + 1,
      'Cache-Control': `private, max-age=5000`,
      'Content-type': mimeType.toString(),
    };

    response.writeHead(206, headers);

    stream.pipe(response);
  };
};
