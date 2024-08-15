import { database } from '@najit-najist/database';
import { EntityLink } from '@najit-najist/schemas';

export function getProductAlergen(link: EntityLink | { name: string }) {
  return database.query.productAlergens.findFirst({
    where: (schema, { eq }) =>
      'id' in link ? eq(schema.id, link.id) : eq(schema.name, link.name),
  });
}
