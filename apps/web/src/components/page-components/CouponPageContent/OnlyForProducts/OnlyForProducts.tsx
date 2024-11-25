import { Paper, PaperHeader } from '@components/common/Paper';

import { SearchForm } from './SearchForm';

export function OnlyForProducts() {
  return (
    <Paper className="py-3 divide-y divide-gray-200 space-y-3">
      <PaperHeader>Pouze pro produkty:</PaperHeader>
      <div className="pt-3 px-3">
        <SearchForm />
      </div>
    </Paper>
  );
}
