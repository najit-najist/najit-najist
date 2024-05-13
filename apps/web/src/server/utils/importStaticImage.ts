import { EntityLink } from '@najit-najist/schemas';
import { getTableName } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { StaticImageData } from 'next/image';

export const importStaticImage = <M extends PgTableWithColumns<any>>(
  model: M,
  ownerId: EntityLink['id'],
  filename: string
): Promise<StaticImageData> =>
  import(`/private/uploads/${getTableName(model)}/${ownerId}/${filename}`).then(
    (value) => value.default
  );
