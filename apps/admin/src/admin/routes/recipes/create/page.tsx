import { defineRouteConfig } from '@medusajs/admin-sdk';
import { TagSolid } from '@medusajs/icons';

import { RouteFocusModal } from '../../../components/RouteFocusModal';
import { CreateRecipeForm } from './CreateRecipeForm';

const RecipesPage = () => {
  return (
    <RouteFocusModal>
      <CreateRecipeForm />
    </RouteFocusModal>
  );
};

export const config = defineRouteConfig({
  label: 'Vytvořit recept',
  icon: TagSolid,
});

export default RecipesPage;
