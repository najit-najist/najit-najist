import { useParams } from 'react-router-dom';

import { TwoColumnPageSkeleton } from '../../../components/Skeleton';
import { TwoColumnPage } from '../../../components/TwoColumnPage';
import { useProductBrand } from '../../../hooks/useProductBrand';

const ProductBrandPage = () => {
  const { id } = useParams();
  const { brand, isLoading, isError, error } = useProductBrand(id!);

  if (isLoading || !brand) {
    return (
      <TwoColumnPageSkeleton
        mainSections={4}
        sidebarSections={3}
        showJSON
        showMetadata
      />
    );
  }

  if (isError) {
    throw error;
  }

  return (
    <TwoColumnPage
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      showJSON
      showMetadata
      data={product}
    >
      <TwoColumnPage.Main>
        <ProductGeneralSection product={product} />
        <ProductMediaSection product={product} />
        <ProductOptionSection product={product} />
        <ProductVariantSection product={product} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <ProductSalesChannelSection product={product} />
        <ProductShippingProfileSection product={product} />
        <ProductOrganizationSection product={product} />
        <ProductAttributeSection product={product} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  );
};

export default ProductBrandPage;
