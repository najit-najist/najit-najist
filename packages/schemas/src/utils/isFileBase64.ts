import { Base64 } from 'js-base64';

import { splitBase64Url } from './splitBase64Url';

const BASE_64_SPLIT = ';base64,';

export const isFileBase64 = (input: string, acceptMediaTypes?: RegExp) => {
  if (!input.includes(BASE_64_SPLIT)) {
    return false;
  }

  const { mediaType, base64, filename } = splitBase64Url(input);

  if (!filename || (acceptMediaTypes && !acceptMediaTypes.test(mediaType))) {
    return false;
  }

  return Base64.isValid(base64);
};
