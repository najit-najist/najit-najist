import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import slugify from 'slugify';

import { EXTENDED_STORE_MODULE } from '../modules/extended_store';
import { ExtendedStoreService } from '../modules/extended_store/service';

export type CreateBrandStepInput = {
  name: string;
  url?: string | null;
};

type CreateBrandWorkflowInput = CreateBrandStepInput;

export const createBrandStep = createStep(
  'create-brand-step',
  async (input: CreateBrandStepInput, { container }) => {
    const brandModuleService: ExtendedStoreService = container.resolve(
      EXTENDED_STORE_MODULE,
    );

    const brand = await brandModuleService.createProductBrands({
      ...input,
      slug: slugify(input.name),
    });

    return new StepResponse(brand, brand.id);
  },
  async (id: string, { container }) => {
    const brandModuleService: ExtendedStoreService = container.resolve(
      EXTENDED_STORE_MODULE,
    );

    await brandModuleService.deleteProductBrands(id);
  },
);

export const createBrandWorkflow = createWorkflow(
  'create-brand',
  (input: CreateBrandWorkflowInput) => {
    const brand = createBrandStep(input);

    return new WorkflowResponse(brand);
  },
);
