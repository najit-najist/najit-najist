import { splitBase64Url } from '@najit-najist/schemas';

export const setFileNameToBase64 = (
  base64Url: string,
  filename: string
): string => {
  const { base64, mediaType } = splitBase64Url(base64Url);

  return `data:${mediaType};filename=${filename};base64,${base64}`;
};
