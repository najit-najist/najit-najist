import path from 'path';

export const PRIVATE_DIRECTORY_PATH = path.join(process.cwd(), 'private');
/**
 * We share large files in static volume on docker level to keep thing at minimal here, this path is just root of that directory on local instance
 */
export const SHARED_STATIC_FILES_DIRECTORY_PATH = path.join(
  process.cwd(),
  'shared-static-assets'
);
export const PRIVATE_VIDEOS_DIRECTORY_PATH = path.join(
  PRIVATE_DIRECTORY_PATH,
  'videos'
);
