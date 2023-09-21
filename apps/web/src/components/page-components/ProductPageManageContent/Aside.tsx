'use client';

import { DEFAULT_DATE_FORMAT } from '@constants';
import { Product } from '@najit-najist/api';
import { Input, Paper } from '@najit-najist/ui';
import dayjs from 'dayjs';
import { FC } from 'react';

export const Aside: FC<
  Partial<Pick<Product, 'updated' | 'created' | 'publishedAt'>>
> = ({ updated, created, publishedAt }) => {
  return (
    <Paper className="p-2 sm:p-5">
      <div className="grid gap-5">
        {created ? (
          <Input
            label="Vytvořeno"
            value={dayjs(created).format(DEFAULT_DATE_FORMAT)}
            disabled
          />
        ) : null}

        {updated ? (
          <Input
            label="Upraveno"
            value={dayjs(updated).format(DEFAULT_DATE_FORMAT)}
            disabled
          />
        ) : null}

        {publishedAt ? (
          <Input
            label="Publikováno"
            value={dayjs(publishedAt).format(DEFAULT_DATE_FORMAT)}
            disabled
          />
        ) : null}
      </div>
    </Paper>
  );
};
