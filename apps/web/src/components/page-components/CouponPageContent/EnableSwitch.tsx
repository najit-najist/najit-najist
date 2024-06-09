'use client';

import { Label, Switch } from '@najit-najist/ui';
import { ReactNode, useId } from 'react';
import { Controller } from 'react-hook-form';

export function EnableSwitch(): ReactNode {
  const id = useId();
  return (
    <Controller
      name="enabled"
      render={({ field, formState }) => (
        <div className="flex-none">
          <Label htmlFor={id} className="sr-only">
            Aktivováno?
          </Label>
          <Switch
            id={id}
            value={Boolean(field.value)}
            className="flex-none"
            disabled={formState.isLoading || formState.isSubmitting}
            onChange={field.onChange}
            onBlur={field.onBlur}
            description="Aktivovat"
          />
        </div>
      )}
    />
  );
}
