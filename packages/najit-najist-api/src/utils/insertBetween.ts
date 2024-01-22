export const insertBetween = <T extends any[]>(array: T, insert: any) => {
  return array
    .filter(Boolean)
    .map((item, index, allItems) =>
      index !== allItems.length - 1 ? [item, insert] : [item]
    )
    .flat(1);
};
