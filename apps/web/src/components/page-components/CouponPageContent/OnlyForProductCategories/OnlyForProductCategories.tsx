'use client';

import { Paper, PaperHeader } from '@components/common/Paper';

import { SearchForm } from './SearchForm';

export function OnlyForProductCategories() {
  return (
    <Paper className="py-3 divide-y divide-gray-200 space-y-3">
      <PaperHeader>Pouze pro kategorie:</PaperHeader>
      <div className="pt-3 px-3">
        <SearchForm />
      </div>
    </Paper>
  );
}
