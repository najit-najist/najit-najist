export const getFileUrl = (
  collectionName: string,
  parentId: string,
  filename: string
) => {
  const parts = [];

  parts.push('files');
  parts.push(encodeURIComponent(collectionName));
  parts.push(encodeURIComponent(parentId));
  parts.push(encodeURIComponent(filename));

  let result = parts.join('/');

  return `/${result}`;
};
