'use client';

import { trpc } from '@client/trpc';
import { AppRouterInput, AppRouterOutput } from '@custom-types/AppRouter';
import { Button } from '@najit-najist/ui';
import { FC, Fragment, useEffect } from 'react';

import { Item } from './Item';

export const InfiniteProducts: FC<{
  initialSearchResult: AppRouterOutput['products']['get']['many'];
  initialSearch: AppRouterInput['products']['get']['many'];
  userDidSearch: boolean;
}> = ({ initialSearch, initialSearchResult, userDidSearch }) => {
  const trpcUtils = trpc.useUtils();

  const {
    data: { pages } = {},
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.products.get.many.useInfiniteQuery(initialSearch, {
    enabled: false,
    initialData: {
      pageParams: [],
      pages: [initialSearchResult],
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  // Reset infinite state if search has been made
  useEffect(() => {
    if (initialSearchResult) {
      trpcUtils.products.get.many.setInfiniteData(initialSearch, {
        pageParams: [],
        pages: [initialSearchResult],
      });
    }
  }, [initialSearch, initialSearchResult]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full divide-y-2 xs:divide-y-0">
        {pages?.map(({ items, nextCursor }) => (
          <Fragment key={nextCursor ?? 'end'}>
            {items.map((props) => (
              <Item key={props.id} {...props} />
            ))}
          </Fragment>
        ))}

        {!pages?.at(0)?.items.length ? (
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            {userDidSearch ? (
              <>Pro Vaše vyhledávání nemáme žádné produkty ☹️</>
            ) : (
              <>Zatím pro Vás nemáme žádné produkty...</>
            )}
          </div>
        ) : null}
      </div>
      {hasNextPage ? (
        <div className="w-full">
          <Button
            appearance="spaceless"
            size="lg"
            className="my-10 mx-auto block"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Načítám další...' : 'Zobrazit další'}
          </Button>
        </div>
      ) : null}
    </>
  );
};
