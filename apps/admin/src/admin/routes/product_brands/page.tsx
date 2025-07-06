import { defineRouteConfig } from '@medusajs/admin-sdk';
import { PencilSquare, TagSolid, Trash } from '@medusajs/icons';
import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  Heading,
  toast,
  useDataTable,
  usePrompt,
} from '@medusajs/ui';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { ProductBrandType } from '../../../modules/extended_store/models/product-brand';
import { ActionMenu } from '../../components/ActionMenu';
import { sdk } from '../../lib/sdk';

type BrandsResponse = {
  brands: ProductBrandType[];
  count: number;
  limit: number;
  offset: number;
};

const columnHelper = createDataTableColumnHelper<ProductBrandType>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('url', {
    header: 'URL',
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      return <ProductBrandActions brand={row.original} />;
    },
  }),
];

const limit = 15;

const ProductBrandActions = ({ brand }: { brand: ProductBrandType }) => {
  const { t } = useTranslation();
  const prompt = usePrompt();

  // const { mutateAsync } = useDeleteRegion(brand.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t('general.areYouSure'),
      description: t('regions.deleteRegionWarning', {
        name: brand.name,
      }),
      verificationText: brand.name,
      verificationInstruction: t('general.typeToConfirm'),
      confirmText: t('actions.delete'),
      cancelText: t('actions.cancel'),
    });

    if (!res) {
      return;
    }

    // await mutateAsync(undefined, {
    //   onSuccess: () => {
    //     toast.success(t('regions.toast.delete'));
    //   },
    //   onError: (error) => {
    //     toast.error(error.message);
    //   },
    // });
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t('actions.edit'),
              to: `/product_brands/${brand.id}`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t('actions.delete'),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  );
};

const ProductBrandsPage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryFn: () =>
      sdk.client.fetch(`/product_brands`, {
        query: {
          limit,
          offset,
        },
      }),
    queryKey: [['product_brands', limit, offset]],
  });

  const table = useDataTable({
    columns,
    data: data?.brands || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    onRowClick: (
      event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      row: ProductBrandType,
    ) => {
      const href = `/product_brands/${row.id}`;

      if (event.metaKey || event.ctrlKey || event.button === 1) {
        window.open(href, '_blank', 'noreferrer');
        return;
      }

      if (event.shiftKey) {
        window.open(href, undefined, 'noreferrer');
        return;
      }

      navigate(href);
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  });

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Značky</Heading>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <DataTable.Search placeholder="Search" autoFocus />
            {/* <DataTable.FilterMenu tooltip="Filter" /> */}
            {/* <DataTable.SortingMenu tooltip="Sort" /> */}
            <Button onClick={() => navigate('/product_brands/create')}>
              Create
            </Button>
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'Značky',
  icon: TagSolid,
});

export default ProductBrandsPage;
