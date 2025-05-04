import {
  defaultDropAnimation,
  DragOverlay,
  DropAnimation,
  Modifier,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FC } from 'react';
import { createPortal } from 'react-dom';

import { SortableTreeItem } from './SortableTreeItem';
import { MappedTreeItem } from './types';
import { getChildCount } from './utils';

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

export const TreeItemClone: FC<{
  indicator: boolean;
  activeId: UniqueIdentifier | null;
  activeItem: MappedTreeItem | null | undefined;
  mappedItems: MappedTreeItem[];
  indentationWidth: number;
}> = ({ indicator, activeId, activeItem, mappedItems, indentationWidth }) =>
  createPortal(
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      modifiers={indicator ? [adjustTranslate] : undefined}
    >
      {activeId && activeItem ? (
        <SortableTreeItem
          id={activeId}
          depth={activeItem.depth}
          clone
          childCount={getChildCount(mappedItems, activeId) + 1}
          value={activeId.toString()}
          indentationWidth={indentationWidth}
        />
      ) : null}
    </DragOverlay>,
    document.body,
  );
