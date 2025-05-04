import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { cx } from 'class-variance-authority';
import React, { forwardRef, HTMLAttributes } from 'react';

import { Action } from './Action';
import { Handle } from './Handle';
import { Remove } from './Remove';

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    return (
      <li
        className={cx(
          'list-none pl-[var(--spacing-start)] -mb-[1px]',
          clone && 'inline-block pointer-events-none p-0 pl-10 pt-1',
          disableSelection && 'pointer-events-none',
          disableInteraction && '',
        )}
        ref={wrapperRef}
        style={
          {
            '--spacing-start': `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          data-type="treeItem"
          className="relative flex items-center py-3 px-3 bg-white border-solid border border-gray-200"
          ref={ref}
          style={style}
        >
          <Handle {...handleProps} />
          {onCollapse && (
            <Action data-type="collapse" onClick={onCollapse}>
              <ChevronUpIcon />
            </Action>
          )}
          <span
            data-type="text"
            className="grow pl-2 whitespace-nowrap overflow-ellipsis overflow-hidden"
          >
            {value}
          </span>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <span
              data-type="count"
              className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-[50%] bg-blue-600 text-sm font-bold text-white"
            >
              {childCount}
            </span>
          ) : null}
        </div>
      </li>
    );
  },
);
