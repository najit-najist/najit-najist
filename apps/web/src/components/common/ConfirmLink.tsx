'use client';

import Link, { LinkProps } from 'next/link';
import { MouseEventHandler, forwardRef, useCallback, useRef } from 'react';

export const ConfirmLink = forwardRef<
  HTMLAnchorElement,
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
      children?: React.ReactNode;
      message?: string;
    } & React.RefAttributes<HTMLAnchorElement>
>(function ConfirmLink(
  { children, onClick, message = 'Opravdu vymazat?', prefetch, ...props },
  ref,
) {
  const onClickRef = useRef(onClick);

  onClickRef.current = onClick;

  const onClickHandler = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      const confirmed = confirm(message);

      if (onClickRef.current) {
        onClickRef.current(event);
      }

      if (!confirmed) {
        event.preventDefault();
      }
    },
    [message],
  );

  return (
    // @ts-expect-error
    <a {...props} onClick={onClickHandler} ref={ref}>
      {children}
    </a>
  );
});
