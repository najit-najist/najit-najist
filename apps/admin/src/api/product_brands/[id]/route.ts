import { MedusaRequest, MedusaResponse } from '@medusajs/framework';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve('query');
  const { id } = req.params;

  const { data: brands } = await query.graph({
    entity: 'product_brand',
    fields: ['id', 'name'],
    filters: {
      id: id,
    },
  });

  const [brand] = brands;

  if (!brand) {
    res.status(404).json({
      error: 'Brand not found',
    });

    return;
  }

  res.json({
    brand,
  });
};
