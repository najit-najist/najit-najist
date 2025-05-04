import { model } from '@medusajs/framework/utils';

export const Metric = model
  .define('metric', {
    id: model.id().primaryKey(),
    name: model.text(),
    type: model.enum(['size', 'fluid', 'mass']),
  })
  .indexes([
    {
      on: ['name', 'type'],
    },
  ]);
