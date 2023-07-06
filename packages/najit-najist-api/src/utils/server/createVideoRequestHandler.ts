import fs from 'fs-extra';
import { lookup } from 'mime-types';
import { PassThrough } from 'stream';
import { NextApiHandler } from 'next';

export interface CreateVideoRequestHandlerOptions {
  /**
   * Absolute video path - will be checked upon creating
   */
  videoPath: string;
}
// TODO: rewrite this to Node@16 ReadableStream
export const createVideoRequestHandler = ({
  videoPath,
}: CreateVideoRequestHandlerOptions): NextApiHandler => {
  if (fs.pathExistsSync(videoPath) === false) {
    throw new Error(
      `File under absolute path "${videoPath}" to handle does not exist`
    );
  }

  const stats = fs.statSync(videoPath);
  const mimeType = lookup(videoPath);
  const filename = videoPath.split('/').pop()!;

  return async (request, response) => {
    const stream = fs.createReadStream(videoPath);
    const headers = new Headers({
      //'Content-Disposition': `attachment; filename="${filename}"`,
      'Accept-Ranges': 'bytes',
      'Content-Length': stats.size.toString(),
      'Cache-Control': `private, max-age=5000`,
      'Content-type': mimeType.toString(),
    });

    for (const header of headers) {
      response.setHeader(header[0], header[1]);
    }

    stream.pipe(response);
  };
};
