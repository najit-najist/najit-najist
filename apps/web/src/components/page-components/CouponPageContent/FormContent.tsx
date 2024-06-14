'use client';

import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Coupon } from '@najit-najist/database/models';
import {
  Alert,
  Button,
  Input,
  Tooltip,
  inputPrefixSuffixStyles,
} from '@najit-najist/ui';
import { useMutation } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues } from './FormProvider';
import { deleteCouponAction } from './actions/deleteCouponAction';

export function FormContent({
  coupon,
  couldBeDeleted,
}: {
  coupon?: { id: Coupon['id'] };
  couldBeDeleted: boolean;
}): ReactNode {
  const { formState, register } = useFormContext<FormValues>();
  const isRedirectingAfterCreate = !coupon?.id && formState.isSubmitSuccessful;
  const {
    mutate: deleteCoupon,
    isLoading: isDeleting,
    data,
  } = useMutation({
    mutationFn: deleteCouponAction,
  });

  const fieldsAreDisabled =
    formState.isSubmitting || isRedirectingAfterCreate || isDeleting;

  return (
    <>
      <div className="px-3 space-y-2 pt-2">
        <Input
          required
          label="Název"
          id="name"
          type="string"
          autoComplete="off"
          error={formState.errors.name}
          disabled={fieldsAreDisabled || !!coupon?.id}
          {...register('name')}
        />
        <Input
          required
          label="Minimální počet produktů"
          id="minimalProductCount"
          type="number"
          autoComplete="off"
          error={formState.errors.minimalProductCount}
          disabled={fieldsAreDisabled}
          {...register('minimalProductCount', { valueAsNumber: true })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            required
            label="Sleva v %"
            id="reductionPercentage"
            type="number"
            suffix={
              <div
                className={inputPrefixSuffixStyles({
                  type: 'suffix',
                  className: 'w-10',
                  centerContent: true,
                })}
              >
                %
              </div>
            }
            error={formState.errors.reductionPercentage}
            disabled={fieldsAreDisabled}
            {...register('reductionPercentage', { valueAsNumber: true })}
          />
          <Input
            required
            label="Sleva v Kč"
            id="reductionPrice"
            type="number"
            suffix={
              <div
                className={inputPrefixSuffixStyles({
                  type: 'suffix',
                  className: 'w-10',
                  centerContent: true,
                })}
              >
                Kč
              </div>
            }
            error={formState.errors.reductionPrice}
            disabled={fieldsAreDisabled}
            {...register('reductionPrice', { valueAsNumber: true })}
          />

          <Input
            label="Aktivní od"
            id="validFrom"
            type="datetime-local"
            error={formState.errors.validFrom}
            disabled={fieldsAreDisabled}
            {...register('validFrom', {
              setValueAs(value) {
                return value ? value : null;
              },
            })}
          />
          <Input
            label="Aktivní do"
            id="validTo"
            type="datetime-local"
            error={formState.errors.validTo}
            disabled={fieldsAreDisabled}
            {...register('validTo', {
              setValueAs(value) {
                return value ? value : null;
              },
            })}
          />
        </div>
      </div>
      <div className="px-3">
        {isRedirectingAfterCreate ? (
          <Alert
            className="mt-3"
            icon={ArrowPathIcon}
            iconClassName="animate-spin"
            heading="Kupón vytvořen. Přecházím na stránku kupónu..."
          />
        ) : null}
        <div className="flex flex-wrap mt-3">
          <Button type="submit" isLoading={fieldsAreDisabled}>
            Uložit
          </Button>
          {coupon ? (
            <Tooltip
              disabled={couldBeDeleted}
              trigger={
                <Button
                  appearance="spaceless"
                  color="red"
                  className="px-2 py-1 ml-auto"
                  disabled={!couldBeDeleted}
                  onClick={() => deleteCoupon(coupon)}
                  isLoading={isDeleting || data !== undefined}
                >
                  <TrashIcon className="w-6 h-6 top-0.5 relative" />
                </Button>
              }
            >
              Nelze odstranit, jelikož byl kupón již využit
            </Tooltip>
          ) : null}
        </div>
      </div>
    </>
  );
}
