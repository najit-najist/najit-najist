import { Module } from '@medusajs/framework/utils';

import { MetricModuleService } from './service';

export const METRIC_MODULE = 'metric';

export default Module(METRIC_MODULE, {
  service: MetricModuleService,
});
