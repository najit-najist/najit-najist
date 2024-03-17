import { database } from '@najit-najist/database';
import { municipalities } from '@najit-najist/database/models';
import { entityLinkSchema } from '@najit-najist/schemas';
import { t } from '@trpc';
import { SQL, and, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

export const municipalityGetRoutes = t.router({
  many: t.procedure
    .input(
      z
        .object({
          query: z.string().optional(),
          page: z.number().min(1).default(1),
          perPage: z.number().min(10).max(100).default(20),
          filter: z
            .object({
              id: z.array(z.number()).optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { page, perPage, query, filter: filterFromInput } = input ?? {};
      const conditions: SQL[] = [];

      if (query) {
        conditions.push(
          or(
            ilike(municipalities.name, `%${query}%`),
            ilike(municipalities.slug, `%${query}%`)
          )!
        );
      }

      if (filterFromInput?.id) {
        conditions.push(
          or(...filterFromInput.id.map((id) => eq(municipalities.id, id)))!
        );
      }

      // TODO: pagination
      return database.query.municipalities.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: (schema, { asc }) => [asc(schema.name)],
        limit: perPage,
      });
    }),

  one: t.procedure.input(entityLinkSchema).query(async ({ input }) => {
    return database.query.municipalities.findFirst({
      where: (schema, { eq }) => eq(schema.id, input.id),
    });
  }),
});

export const municipalityRoutes = t.router({
  get: municipalityGetRoutes,
});

export const addressRoutes = t.router({
  municipality: municipalityRoutes,
});
