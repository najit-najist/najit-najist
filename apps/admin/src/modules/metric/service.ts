import { MedusaService } from '@medusajs/framework/utils';

import { Metric } from './models/metric';

export class MetricModuleService extends MedusaService({
  Metric,
}) {}
