import { config } from '@najit-najist/api/dist/config';
import { notFound } from 'next/navigation';

type Context = { params: { collection: string; id: string; filename: string } };

export async function GET(
  request: Request,
  { params: { collection, filename, id } }: Context
) {
  const parts = [];
  parts.push('api');
  parts.push('files');
  parts.push(encodeURIComponent(collection));
  parts.push(encodeURIComponent(id));
  parts.push(encodeURIComponent(filename));

  const fileResp = await fetch(new URL(parts.join('/'), config.pb.origin));

  if (fileResp.status === 404) {
    return notFound();
  }

  return fileResp;
}
