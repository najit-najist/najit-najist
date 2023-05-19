import { AvailableModels } from './canUser';

export type GetFileUrlOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

const getThumbParam = (width?: number, height?: number): string =>
  `${width ?? 0}x${height ?? 0}`;

export const getFileUrl = (
  collectionName: AvailableModels,
  parentId: string,
  filename: string,
  options?: GetFileUrlOptions
) => {
  const parts = [];
  const { width, height } = options ?? {};

  parts.push('files');
  parts.push(encodeURIComponent(collectionName));
  parts.push(encodeURIComponent(parentId));
  parts.push(encodeURIComponent(filename));

  let result = parts.join('/');

  const searchParams = new URLSearchParams();

  if (height || width) {
    searchParams.set('thumb', getThumbParam(width, height));
  }

  return `/${result}?${searchParams.toString()}`;
};
