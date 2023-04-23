import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { RouteType } from 'next/dist/lib/load-custom-routes';
import Link from 'next/link';
import { LinkProps } from 'next/link';
import {
  DetailedHTMLProps,
  FC,
  Fragment,
  HTMLAttributes,
  ReactNode,
} from 'react';

export type ItemData = {
  link?: LinkProps<RouteType>['href'];
  content: ReactNode;
};

const itemClassNames = clsx('text-sm uppercase font-semibold');

export const Breadcrumbs: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    items: ItemData[];
  }
> = ({ items, ...rest }) => {
  const chevron = <ChevronRightIcon className="w-3 h-3" />;

  return (
    <nav role="navigation" {...rest}>
      <ul className="flex items-center gap-5">
        <li>
          <Link href="/portal">
            <HomeIcon className="h-4 w-4 text-deep-green-400" />
          </Link>
        </li>
        {chevron}
        {items.map(({ content, link }, index, items) => (
          <Fragment key={(link ?? index).toString()}>
            {link ? (
              <Link
                className={clsx(
                  itemClassNames,
                  'hover:underline hover:text-blue-800'
                )}
                href={link}
              >
                {content}
              </Link>
            ) : (
              <div className={itemClassNames}>{content}</div>
            )}

            {items.length - 1 !== index ? chevron : null}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};
