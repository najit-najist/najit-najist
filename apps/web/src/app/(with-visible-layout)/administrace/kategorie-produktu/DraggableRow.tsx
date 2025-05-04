'use client';

import { DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cx } from 'class-variance-authority';
import {
  createContext,
  CSSProperties,
  FC,
  PropsWithChildren,
  ReactNode,
} from 'react';

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

export const DraggableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export const DraggableRow: FC<
  PropsWithChildren<{ id: string; slotAfter?: ReactNode; className?: string }>
> = ({ id, children, slotAfter, className }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div style={style}>
      <div
        ref={setNodeRef}
        className={cx(
          'flex bg-white border border-gray-100 rounded-lg items-center',
          className,
        )}
      >
        <button
          className="DragHandle text-gray-400 px-2 active:cursor-grabbing cursor-grab"
          {...attributes}
          {...listeners}
          ref={setActivatorNodeRef}
        >
          <svg viewBox="0 0 20 20" width="17">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
        {children}
      </div>
      {slotAfter}
    </div>
  );
};
