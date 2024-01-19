import { HomeIcon } from '@heroicons/react/24/outline';
import { cx } from 'class-variance-authority';
import Link from 'next/link.js';
import { FC } from 'react';

export type BreadcrumbItem = {
  link: string;
  active?: boolean;
  text?: string;
  className?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link.default
              href="/"
              className="text-gray-400 hover:text-gray-500"
            >
              <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Domů</span>
            </Link.default>
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
              <Link.default
                href={page.link}
                className={cx(
                  'ml-4 text-sm font-medium',
                  page.active
                    ? 'text-project-secondary hover:text-project-primary hover:underline'
                    : 'text-gray-500 hover:text-gray-700',
                  page.className
                )}
                aria-current={page.active ? 'page' : undefined}
              >
                {page.text ?? page.link}
              </Link.default>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
