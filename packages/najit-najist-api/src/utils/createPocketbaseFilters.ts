export type PocketbaseFilterItemAsObject = {
  leftSide: string;
  rightSide: string | number | boolean;
  operator?: PocketbaseOperators;
};

export type PocketbaseFilter = (
  | string
  | null
  | undefined
  | false
  | 'OR'
  | 'AND'
  | PocketbaseFilterItemAsObject
  | PocketbaseFilter
)[];

export enum PocketbaseOperators {
  EQUAL = '=',
  LIKE = '~',
}

const partToPocketbaseRule = {
  OR: '||',
  AND: '&&',
};

export const createPocketbaseFilters = (filters: PocketbaseFilter): string => {
  return filters
    .filter((item) => item !== null && item !== undefined && item !== false)
    .map((item) => {
      if (item === null || item === undefined || item === false) {
        throw new Error('Item should not be null or undefined');
      }

      if (Array.isArray(item)) {
        const filterResult = createPocketbaseFilters(item);

        if (item.length === 1) {
          return filterResult;
        }
        return `(${filterResult})`;
      } else if (typeof item === 'object') {
        let formattedRightSide = item?.rightSide;

        if (typeof formattedRightSide === 'string') {
          formattedRightSide = `'${formattedRightSide}'`;
        }

        return [item?.leftSide, String(formattedRightSide)].join(
          item.operator ?? PocketbaseOperators.EQUAL
        );
      } else if (Object.hasOwn(partToPocketbaseRule, item!)) {
        return partToPocketbaseRule[item as keyof typeof partToPocketbaseRule];
      }

      return item;
    })
    .join(' ');
};
