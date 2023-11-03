import { PocketbaseCollections } from '@custom-types';
import { pocketbase, type ListResult } from '@najit-najist/pb';
import { getManyMunicipalitySchema, Municipality } from '@schemas';
import { t } from '@trpc';
import { z } from 'zod';

export const municipalityGetRoutes = t.router({
  many: t.procedure
    .input(getManyMunicipalitySchema.optional())
    .query(async ({ input }): Promise<ListResult<Municipality>> => {
      const { page, perPage, query, filter: filterFromInput } = input ?? {};
      const filter = [
        query ? `name ~ '${query}' || slug ~ '${query}'` : undefined,
        filterFromInput?.id
          ? `(${filterFromInput.id
              .map((itemId) => `id = '${itemId}'`)
              .join(' || ')})`
          : undefined,
      ].filter(Boolean);

      return pocketbase
        .collection(PocketbaseCollections.MUNICIPALITY)
        .getList<Municipality>(page, perPage, {
          sort: '-name',
          filter: filter.join(' && '),
        });
    }),

  one: t.procedure
    .input(z.string())
    .query(async ({ input }): Promise<Municipality> => {
      return pocketbase
        .collection(PocketbaseCollections.MUNICIPALITY)
        .getOne<Municipality>(input);
    }),
});

export const municipalityRoutes = t.router({
  get: municipalityGetRoutes,
});

export const addressRoutes = t.router({
  municipality: municipalityRoutes,
});
