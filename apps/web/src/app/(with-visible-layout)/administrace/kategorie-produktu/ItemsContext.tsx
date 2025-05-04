'use client';

import { ProductCategory } from '@najit-najist/database/models';
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

export type ExtendedProductCategory = Omit<
  ProductCategory,
  'id' | 'parentId'
> & {
  level: number;
  id: string;
  products: { id: number }[];
  parentId: string | null;
};

export type ExtendedProductCategoryIterable = ExtendedProductCategory & {
  children: ExtendedProductCategoryIterable[];
};

const itemsContext = createContext<
  [
    Map<string, ExtendedProductCategoryIterable>,
    Dispatch<SetStateAction<ExtendedProductCategory[]>>,
  ]
>([new Map(), () => {}]);

export const ItemsProvider: FC<
  PropsWithChildren<{ value: ExtendedProductCategory[] }>
> = ({ value, children }) => {
  const [flatItems, setFlatItems] = useState<ExtendedProductCategory[]>(value);

  const flatItemsMap = useMemo((): Map<
    string,
    ExtendedProductCategoryIterable
  > => {
    const itemsAsMap = new Map<string, ExtendedProductCategoryIterable>();

    // First do every item
    for (const item of flatItems) {
      const currentItemId = String(item.id);
      itemsAsMap.set(currentItemId, { ...item, children: [] });
    }

    // And then link children between its parents
    for (const item of flatItems) {
      if (!item.parentId) {
        continue;
      }

      const currentItemId = String(item.id);
      const createdParent = itemsAsMap.get(String(item.parentId));

      if (createdParent) {
        createdParent.children.push(itemsAsMap.get(currentItemId)!);
      }
    }

    return itemsAsMap;
  }, [flatItems]);

  return (
    <itemsContext.Provider value={[flatItemsMap, setFlatItems]}>
      {children}
    </itemsContext.Provider>
  );
};

export const useItems = () => useContext(itemsContext)[0];
export const useSetItems = () => useContext(itemsContext)[1];
