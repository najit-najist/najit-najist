import { getFileUrl as getFileUrlOriginal } from '@najit-najist/pb';

import { AvailableModels } from './canUser';

export type GetFileUrlOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

/**
 * @deprecated
 */
export const getFileUrl = (
  collectionName: AvailableModels,
  parentId: string,
  filename: string,
  options?: GetFileUrlOptions
) => {
  return getFileUrlOriginal(collectionName as any, parentId, filename, options);
};
