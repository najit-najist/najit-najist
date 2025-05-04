import { defineRouteConfig } from '@medusajs/admin-sdk';
import { TagSolid } from '@medusajs/icons';

import { RouteFocusModal } from '../../../components/RouteFocusModal';

const CreateProductBrandPage = () => {
  return <RouteFocusModal></RouteFocusModal>;
};

export const config = defineRouteConfig({
  label: 'Vytvořit výrobce',
  icon: TagSolid,
});

export default CreateProductBrandPage;
