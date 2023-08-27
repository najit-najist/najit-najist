import { splitBase64Url } from './splitBase64Url';

export const getMediaTypeFromBase64Url = (input: string) => {
  return splitBase64Url(input).mediaType;
};
