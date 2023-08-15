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
  console.log({ videoPath });
  console.log('Before exists');
  if (fs.pathExistsSync(videoPath) === false) {
    throw new Error(
      `File under absolute path "${videoPath}" to handle does not exist`
    );
  }

  const stats = fs.statSync(videoPath);
  console.log({ stats });
  const mimeType = lookup(videoPath);
  console.log({ mimeType });

  return async (request, response) => {
    const { range } = request.headers;
    console.log({ range });

    if (!range) {
      return response.status(400).send('Include Range Header');
    }
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + MAX_CHUNK_SIZE, stats.size - 1);
    console.log({ start, end });

    const stream = fs.createReadStream(videoPath, { start, end });
    console.log('stream created');
    const headers = {
      //'Content-Disposition': `attachment; filename="${filename}"`,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      'Content-Length': end - start + 1,
      'Cache-Control': `private, max-age=5000`,
      'Content-type': mimeType.toString(),
    };
    console.log({ headers });

    response.writeHead(206, headers);
    console.log('before pipe');

    stream.pipe(response);
  };
};
