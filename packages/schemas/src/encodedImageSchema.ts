import { z } from 'zod';

import { isFileBase64 } from './utils/isFileBase64';

export const IMAGE_FILE_REGEX = /image\/(jp(e)?g|webp|gif|png|svg\+xml)/;

export const encodedImageSchema = z.string().refine((input) => {
  if (input.startsWith('data:')) {
    return isFileBase64(input, IMAGE_FILE_REGEX);
  }

  return true;
});
