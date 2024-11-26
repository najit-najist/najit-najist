import { getTableName } from '@najit-najist/database/drizzle';
import { EntityLink } from '@najit-najist/schemas';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { StaticImageData } from 'next/image';

export const importStaticImage = <M extends PgTableWithColumns<any>>(
  model: M,
  ownerId: EntityLink['id'],
  filename: string,
): Promise<StaticImageData> =>
  import(
    /* webpackIgnore: true */ `/private/uploads/${getTableName(
      model,
    )}/${ownerId}/${filename}`
  ).then((value) => value.default);
