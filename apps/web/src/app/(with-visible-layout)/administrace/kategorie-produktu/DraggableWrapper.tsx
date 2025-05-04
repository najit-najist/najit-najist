'use client';

import {
  Active,
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverEvent,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FC, PropsWithChildren, useId, useState } from 'react';

import { Row } from './DynamicRoot';
import { useItems, useSetItems } from './ItemsContext';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

export const DraggableWrapper: FC<PropsWithChildren> = ({ children }) => {
  const id = useId();
  const [active, setActive] = useState<Active | null>(null);
  const items = useItems();
  const setItems = useSetItems();
  const activeItem = items.get(String(active?.id));
  const onlyRootItems = [...items.values()].filter((item) => !item.parentId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragOver(event: DragOverEvent) {
    const { active, over, delta } = event;

    let overId: string | undefined;
    if (over) {
      overId = over.id.toString();
    }

    const activeItem = items.get(active.id.toString())!;
    const overItem = overId ? items.get(overId) : undefined;

    const overIsContainer = overId?.endsWith('-children');
    const overIdContainerOwnerId = overIsContainer
      ? overId?.replace('-children', '')
      : undefined;

    const isOverItsOwnChildren = overIdContainerOwnerId === activeItem.id;
    console.log({ overId, overIdContainerOwnerId, active: active.id, delta });
    if (isOverItsOwnChildren) {
      return;
    }

    const shouldMoveToRoot =
      activeItem.parentId &&
      (overId === undefined || (overItem && !overItem.parentId));

    const isOverItsOwnParent = activeItem.parentId === overIdContainerOwnerId;
    const isTargettingOtherChildrenContainer =
      overIdContainerOwnerId && !isOverItsOwnParent;

    const shouldChangeLevels =
      isTargettingOtherChildrenContainer || shouldMoveToRoot;

    if (!shouldChangeLevels) {
      return;
    }

    setItems((prevItems) => {
      let newItems = [...prevItems];
      const activeItemFromItems = newItems.find(
        (item) => item.id === activeItem.id,
      )!;

      if (isTargettingOtherChildrenContainer) {
        activeItemFromItems.parentId = overIdContainerOwnerId;
      } else if (shouldMoveToRoot) {
        activeItemFromItems.parentId = null;
      }

      return newItems;
    });

    // const overParent = findParent(overId);
    // const overIsContainer = isContainer(overId);
    // const activeIsContainer = isContainer(activeId);
    // if (overIsContainer) {
    //   const overIsRow = isRow(overId);
    //   const activeIsRow = isRow(activeId);
    //   // only columns to be added to rows
    //   if (overIsRow) {
    //     if (activeIsRow) {
    //       return;
    //     }

    //     if (!activeIsContainer) {
    //       return;
    //     }
    //   } else if (activeIsContainer) {
    //     return;
    //   }
    // }
    //

    // setData((prev) => {
    //   const activeIndex = data.items.findIndex((item) => item.id === id);
    //   const overIndex = data.items.findIndex((item) => item.id === overId);

    //   let newIndex = overIndex;
    //   const isBelowLastItem =
    //     over &&
    //     overIndex === prev.items.length - 1 &&
    //     draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

    //   const modifier = isBelowLastItem ? 1 : 0;

    //   newIndex = overIndex >= 0 ? overIndex + modifier : prev.items.length + 1;

    //   let nextParent;
    //   if (overId) {
    //     nextParent = overIsContainer ? overId : overParent;
    //   }

    //   prev.items[activeIndex].parent = nextParent;
    //   const nextItems = arrayMove(prev.items, activeIndex, newIndex);

    //   return {
    //     items: nextItems
    //   };
    // });
  }

  return (
    <DndContext
      id={id}
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragOver={handleDragOver}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const itemsArray = [...items.values()];
          const activeIndex = itemsArray.findIndex(
            ({ id }) => id === active.id,
          );
          const overIndex = itemsArray.findIndex(({ id }) => id === over.id);

          console.log({ activeIndex, overIndex });
          // setItems(arrayMove(itemsArray, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext
        items={onlyRootItems}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeItem ? <Row item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
