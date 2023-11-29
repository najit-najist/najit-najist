export const getItemId = (item: string | { id: string }) =>
  typeof item === 'string' ? item : item.id;
