import type * as Execa from 'execa';
import fs from 'fs-extra';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import path from 'node:path';
import { Stream } from 'node:stream';
import type { Readable } from 'node:stream';

type Context = {
  params: Promise<{ collection: string; id: string; filename: string }>;
};
const appRoot = process.cwd();
const databasePackageRoot = path.join(
  appRoot,
  '..',
  '..',
  'packages',
  'database',
);

// Borrowed from remix. Props to them!
const createReadableStreamFromReadable = (
  source: Readable & { readableHighWaterMark?: number },
) => {
  let pump = new StreamPump(source);
  let stream = new ReadableStream(pump, pump);
  return stream;
};

class StreamPump {
  public highWaterMark: number;
  public accumalatedSize: number;
  private stream: Stream & {
    readableHighWaterMark?: number;
    readable?: boolean;
    resume?: () => void;
    pause?: () => void;
    destroy?: (error?: Error) => void;
  };
  private controller?: ReadableStreamController<Uint8Array>;

  constructor(
    stream: Stream & {
      readableHighWaterMark?: number;
      readable?: boolean;
      resume?: () => void;
      pause?: () => void;
      destroy?: (error?: Error) => void;
    },
  ) {
    this.highWaterMark =
      stream.readableHighWaterMark ||
      new Stream.Readable().readableHighWaterMark;
    this.accumalatedSize = 0;
    this.stream = stream;
    this.enqueue = this.enqueue.bind(this);
    this.error = this.error.bind(this);
    this.close = this.close.bind(this);
  }

  size(chunk: Uint8Array) {
    return chunk?.byteLength || 0;
  }

  start(controller: ReadableStreamController<Uint8Array>) {
    this.controller = controller;
    this.stream.on('data', this.enqueue);
    this.stream.once('error', this.error);
    this.stream.once('end', this.close);
    this.stream.once('close', this.close);
  }

  pull() {
    this.resume();
  }

  cancel(reason?: Error) {
    if (this.stream.destroy) {
      this.stream.destroy(reason);
    }

    this.stream.off('data', this.enqueue);
    this.stream.off('error', this.error);
    this.stream.off('end', this.close);
    this.stream.off('close', this.close);
  }

  enqueue(chunk: Uint8Array | string) {
    if (this.controller) {
      try {
        let bytes = chunk instanceof Uint8Array ? chunk : Buffer.from(chunk);

        let available = (this.controller.desiredSize || 0) - bytes.byteLength;
        this.controller.enqueue(bytes);
        if (available <= 0) {
          this.pause();
        }
      } catch (error: any) {
        this.controller.error(
          new Error(
            'Could not create Buffer, chunk must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object',
          ),
        );
        this.cancel();
      }
    }
  }

  pause() {
    if (this.stream.pause) {
      this.stream.pause();
    }
  }

  resume() {
    if (this.stream.readable && this.stream.resume) {
      this.stream.resume();
    }
  }

  close() {
    if (this.controller) {
      this.controller.close();
      delete this.controller;
    }
  }

  error(error: Error) {
    if (this.controller) {
      this.controller.error(error);
      delete this.controller;
    }
  }
}

let execa: (typeof Execa)['$'] | undefined = undefined;

export async function GET(request: Request, { params }: Context) {
  const { collection, id, filename } = await params;
  let filePath = path.join(
    appRoot,
    'private',
    'uploads',
    collection,
    id,
    filename,
  );

  if (!(await fs.pathExists(filePath))) {
    // Move from backup
    if (process.env.NODE_ENV === 'development') {
      if (!execa) {
        execa = (await import('execa')).$;
      }

      const foundFilepath = await execa({
        cwd: databasePackageRoot,
      })`find . -type f -name ${filename}`;

      const { stdout: relativeFilepath } = foundFilepath;

      if (relativeFilepath) {
        console.log(`Copying ${relativeFilepath}`);
        await fs.copy(
          path.join(databasePackageRoot, relativeFilepath),
          path.join(path.dirname(filePath), path.basename(relativeFilepath)),
        );
      } else {
        console.log(`Not found for copying: find . -type f -name ${filename}`);
        notFound();
      }
    } else {
      notFound();
    }
  }

  const fileStream = createReadableStreamFromReadable(
    fs.createReadStream(filePath),
  );

  return new NextResponse(fileStream);
}
