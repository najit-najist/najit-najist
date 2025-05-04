import { MedusaService } from '@medusajs/framework/utils';

import { ProductAlergen } from './models/product-alergen';
import { ProductBrand } from './models/product-brand';
import { ProductMaterial } from './models/product-material';

export class ExtendedStoreService extends MedusaService({
  ProductAlergen,
  ProductBrand,
  ProductMaterial,
}) {}
