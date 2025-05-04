import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve('query');

  const { data: recipes, metadata: { count, take, skip } = {} } =
    await query.graph({
      entity: 'recipes',
      ...req.queryConfig,
    });

  res.json({
    recipes,
    count,
    limit: take,
    offset: skip,
  });
};
