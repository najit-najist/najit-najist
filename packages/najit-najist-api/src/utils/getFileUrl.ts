import { EntityLink } from '@najit-najist/schemas';
import { getTableName } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

const getThumbParam = (width?: number, height?: number): string =>
  `${width ?? 0}x${height ?? 0}`;

export type GetFileUrlOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export const getFileUrl = <M extends PgTableWithColumns<any>>(
  model: M,
  ownerId: EntityLink['id'],
  filename: string,
  options?: GetFileUrlOptions
) => {
  const parts = [];
  const { width, height } = options ?? {};

  parts.push('files');
  parts.push(encodeURIComponent(getTableName(model)));
  parts.push(encodeURIComponent(ownerId));
  parts.push(encodeURIComponent(filename));

  let result = parts.join('/');

  const searchParams = new URLSearchParams();

  if (height || width) {
    searchParams.set('thumb', getThumbParam(width, height));
  }

  return `/${result}?${searchParams.toString()}`;
};
