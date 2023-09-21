'use client';

import { DEFAULT_DATE_FORMAT } from '@constants';
import { Recipe } from '@najit-najist/api';
import { Input, Paper } from '@najit-najist/ui';
import dayjs from 'dayjs';
import { FC } from 'react';

export const Aside: FC<Partial<Pick<Recipe, 'updated' | 'created'>>> = ({
  updated,
  created,
}) => {
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
      </div>
    </Paper>
  );
};
