import { defineRouteConfig } from '@medusajs/admin-sdk';
import { TagSolid } from '@medusajs/icons';

import { RouteFocusModal } from '../../../components/RouteFocusModal';
import { CreateProductBrandForm } from './CreateProductBrandForm';

const CreateProductBrandPage = () => {
  return (
    <RouteFocusModal>
      <CreateProductBrandForm />
    </RouteFocusModal>
  );
};

export const config = defineRouteConfig({
  label: 'Vytvořit výrobce',
  icon: TagSolid,
});

export default CreateProductBrandPage;
