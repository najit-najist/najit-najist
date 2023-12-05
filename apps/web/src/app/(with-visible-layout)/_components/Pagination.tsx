'use client';

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC, useTransition } from 'react';

export const Pagination: FC<{
  totalItems?: number;
  totalPages: number;
  currentPage: number;
}> = ({ currentPage, totalPages, totalItems }) => {
  const [isLoading, activateIsLoading] = useTransition();
  const router = useRouter();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || currentPage === 0;

  const changePage = (toIndex: number) => {
    const clamped = Math.min(totalPages, Math.max(1, toIndex));
    let route = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set('page', String(clamped));

    activateIsLoading(() => {
      // @ts-ignore
      router.replace(`${route}?${searchParams}`);
    });
  };

  const goFirst = () => changePage(1);
  const goLast = () => changePage(totalPages);

  const goPrevious = () => changePage(currentPage - 1);
  const goNext = () => changePage(currentPage + 1);

  return (
    <div className="flex flex-wrap items-center justify-between w-full py-3">
      {totalItems ? <div>Celkový počet: {totalItems}</div> : null}
      <div className="flex w-[100px] items-center justify-center text-sm font-medium ml-auto mr-4">
        Stránka {currentPage} z {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          className="h-8 w-8 flex items-center justify-center"
          onClick={goFirst}
          disabled={isLoading || isFirstPage}
          appearance="spaceless"
        >
          <span className="sr-only">Jít na první stránku</span>
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          className="h-8 w-8 flex items-center justify-center"
          onClick={goPrevious}
          disabled={isLoading || isFirstPage}
          appearance="spaceless"
        >
          <span className="sr-only">Předešlá stránka</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          className="h-8 w-8 flex items-center justify-center"
          onClick={goNext}
          disabled={isLoading || isLastPage}
          appearance="spaceless"
        >
          <span className="sr-only">Další stránka</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          className="h-8 w-8 flex items-center justify-center"
          onClick={goLast}
          disabled={isLoading || isLastPage}
          appearance="spaceless"
        >
          <span className="sr-only">Jít na poslední stránku</span>
          <ChevronDoubleRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
