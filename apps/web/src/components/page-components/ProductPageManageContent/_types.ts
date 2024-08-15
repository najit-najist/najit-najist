import type { createProductAction } from './actions/createProductAction';

export type ViewType = 'create' | 'edit' | 'view';
export type ProductFormData = Parameters<typeof createProductAction>['0'];
