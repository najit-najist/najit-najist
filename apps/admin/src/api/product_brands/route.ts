import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

import { createBrandWorkflow } from '../../workflows/create-brand';
import { PostCreateProductBrand } from './validators';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve('query');

  const { data: brands, metadata: { count, take, skip } = {} } =
    await query.graph({
      entity: 'product_brand',
      ...req.queryConfig,
    });

  res.json({
    brands,
    count,
    limit: take,
    offset: skip,
  });
};

export const POST = async (
  req: MedusaRequest<PostCreateProductBrand>,
  res: MedusaResponse,
) => {
  const { result } = await createBrandWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.json({ brand: result });
};
