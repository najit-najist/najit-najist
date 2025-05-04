import { defineRouteConfig } from '@medusajs/admin-sdk';
import { TagSolid } from '@medusajs/icons';
import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  Heading,
  useDataTable,
} from '@medusajs/ui';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { sdk } from '../../lib/sdk';

type Recipe = {
  id: string;
  title: string;
  description: string;
};
type RecipeResponse = {
  recipes: Recipe[];
  count: number;
  limit: number;
  offset: number;
};

const columnHelper = createDataTableColumnHelper<Recipe>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('title', {
    header: 'Titulek',
  }),
  columnHelper.accessor('description', {
    header: 'Popisek',
  }),
];

const limit = 15;

const ProductBrandsPage = () => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const navigate = useNavigate();
  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading } = useQuery<RecipeResponse>({
    queryFn: () =>
      sdk.client.fetch(`/recipes`, {
        query: {
          limit,
          offset,
        },
      }),
    queryKey: [['recipes', limit, offset]],
  });

  const table = useDataTable({
    columns,
    data: data?.recipes || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    onRowClick: (_event, row) => {
      alert(`Navigate to ${row.id}`);
    },
  });

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Recepty</Heading>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <DataTable.Search placeholder="Search" autoFocus />
            {/* <DataTable.FilterMenu tooltip="Filter" /> */}
            {/* <DataTable.SortingMenu tooltip="Sort" /> */}
            <Button onClick={() => navigate('/recipes/create')}>Create</Button>
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'Recepty',
  icon: TagSolid,
});

export default ProductBrandsPage;
