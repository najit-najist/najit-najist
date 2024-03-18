import { splitBase64Url } from '@najit-najist/schemas';

export const getMediaTypeFromBase64Url = (input: string) => {
  return splitBase64Url(input).mediaType;
};
