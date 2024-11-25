'use client';

import { Paper } from '@components/common/Paper';
import { Input } from '@components/common/form/Input';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { Recipe } from '@najit-najist/database/models';
import { FC } from 'react';

export const Aside: FC<Partial<Pick<Recipe, 'createdAt' | 'updatedAt'>>> = ({
  updatedAt,
  createdAt,
}) => {
  return (
    <Paper className="p-2 sm:p-5">
      <div className="grid gap-5">
        {createdAt ? (
          <Input
            label="Vytvořeno"
            value={dayjs.tz(createdAt).format(DEFAULT_DATE_FORMAT)}
            disabled
          />
        ) : null}

        {updatedAt ? (
          <Input
            label="Upraveno"
            value={dayjs.tz(updatedAt).format(DEFAULT_DATE_FORMAT)}
            disabled
          />
        ) : null}
      </div>
    </Paper>
  );
};
