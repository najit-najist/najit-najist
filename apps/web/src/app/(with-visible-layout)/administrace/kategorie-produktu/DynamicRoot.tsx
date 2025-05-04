'use client';

import { buttonStyles } from '@components/common/Button/buttonStyles';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cx } from 'class-variance-authority';
import Link from 'next/link';
import { FC } from 'react';

import { DraggableRow } from './DraggableRow';
import { ExtendedProductCategoryIterable, useItems } from './ItemsContext';

const DATE_FORMAT = 'DD.MM. YYYY v HH:mm';

export const Row: FC<{
  item: ExtendedProductCategoryIterable;
}> = ({ item }) => {
  const draggableId = String(item.id);

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: `${draggableId}-children`,
  });

  const childrenRender = (
    <div className="pl-10">
      <ul
        className={cx(
          'bg-blue-50 w-full border-dashed border-gray-100 rounded',
          isOver ? 'min-h-7' : 'min-h-0',
        )}
        ref={setDroppableNodeRef}
      >
        <SortableContext
          items={item.children}
          strategy={verticalListSortingStrategy}
        >
          {item.children.map((item) => (
            <li key={item.id}>
              <Row item={item} />
            </li>
          ))}
        </SortableContext>
      </ul>
    </div>
  );

  return (
    <DraggableRow
      id={draggableId}
      slotAfter={childrenRender}
      className="pr-3 py-2"
    >
      <div className="whitespace-nowrap text-lg pl-4 pr-3 sm:pl-0">
        {item.name}
      </div>
      <div className="ml-auto text-right text-sm text-gray-400">
        {item.products.length} produkt
      </div>
      <div className="ml-5 relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <Link
          href={`/administrace/kategorie-produktu/${item.id}`}
          className={buttonStyles({
            size: 'sm',
            appearance: 'link',
          })}
        >
          Upravit
          <span className="sr-only">, {item.name}</span>
        </Link>
      </div>
    </DraggableRow>
  );
};

export const DynamicRoot: FC = () => {
  const items = useItems();
  const onlyRootItems = [...items.values()].filter((item) => !item.parentId);

  return items.size ? (
    onlyRootItems.map((item) => (
      <li key={item.id}>
        <Row item={item} />
      </li>
    ))
  ) : (
    <li className="text-center py-5">Zatím žádné kategorie...</li>
  );
};
