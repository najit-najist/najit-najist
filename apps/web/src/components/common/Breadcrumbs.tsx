import { cx } from 'class-variance-authority';
import { clsx } from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

export type BreadcrumbItem = {
  link: string;
  active?: boolean;
  text?: string;
  className?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={clsx('hidden sm:flex', className)} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              href="/"
              className="text-project-primary text-opacity-80 hover:text-opacity-100 text-sm font-medium"
            >
              najitnajist.cz
            </Link>
          </div>
        </li>
        {items.map((page) => (
          <li key={page.link}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                href={page.link}
                className={cx(
                  'ml-4 text-sm font-medium',
                  page.active
                    ? 'text-project-secondary hover:text-project-primary hover:underline'
                    : 'text-gray-500 hover:text-gray-700',
                  page.className,
                )}
                aria-current={page.active ? 'page' : undefined}
              >
                {page.text ?? page.link}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
