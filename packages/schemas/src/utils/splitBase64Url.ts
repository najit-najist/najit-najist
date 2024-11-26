const BASE_64_SPLIT = ';base64,';

export const splitBase64Url = (input: string) => {
  const [mediaTypeWithData, base64] = input
    .replace('data:', '')
    .split(BASE_64_SPLIT);

  const [mediaType, ...otherData] = mediaTypeWithData.split(';');
  const { filename } = Object.fromEntries(
    otherData.map((item) => item.split('=') as [string, string]),
  ) as { filename?: string };

  return { mediaType, base64, filename };
};
