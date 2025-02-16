'use server';

import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { ADMIN_LIST_VIEW_COOKIE_NAME } from './_constants';
import { OrderPageListView } from './_types';

export const changeListViewAction = createActionWithValidation(
  z.object({
    listView: z.nativeEnum(OrderPageListView),
  }),
  async (input) => {
    let route = '/administrace/objednavky';

    const allCookies = await cookies();

    allCookies.set(ADMIN_LIST_VIEW_COOKIE_NAME, input.listView);

    if (input.listView !== OrderPageListView.ALL) {
      route += `?listView=${input.listView}`;
    }

    throw redirect(route);
  },
);
