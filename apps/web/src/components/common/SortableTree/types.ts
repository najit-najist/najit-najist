import type { UniqueIdentifier } from '@dnd-kit/core';
import type { MutableRefObject } from 'react';

export interface TreeItem {
  id: UniqueIdentifier;
  collapsed?: boolean;
  index: number;
  parentId: UniqueIdentifier | null;
}

export interface MappedTreeItem extends TreeItem {
  depth: number;
  children: MappedTreeItem[];
}

export type SensorContext = MutableRefObject<{
  items: MappedTreeItem[];
  offset: number;
}>;
