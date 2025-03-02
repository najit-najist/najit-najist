'use client';

import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { OrderPaymentMethodWithRelations } from '@custom-types';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import {
  OrderDeliveryMethod,
  OrderPaymentMethodsSlugs,
} from '@najit-najist/database/models';
import { cx } from 'class-variance-authority';
import Image from 'next/image';
import { FC, useMemo } from 'react';
import { useController, useFormState, useWatch } from 'react-hook-form';

export const PaymentMethodFormPart: FC<{
  paymentMethods: OrderPaymentMethodWithRelations[];
}> = ({ paymentMethods }) => {
  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const selectedDeliverySlug = useWatch<
    { deliveryMethod: OrderDeliveryMethod },
    'deliveryMethod.slug'
  >({
    name: 'deliveryMethod.slug',
  });

  const controller = useController({
    name: 'paymentMethod',
  });

  const filteredPaymentMethods = useMemo(
    () =>
      paymentMethods.filter(
        (item) =>
          !item.exceptDeliveryMethods
            .map(({ slug }) => slug)
            .includes(selectedDeliverySlug),
      ),
    [selectedDeliverySlug, paymentMethods],
  );

  const disabled = formState.isSubmitting || isActive;

  if (!filteredPaymentMethods.length) {
    return null;
  }

  return (
    <>
      <RadioGroup
        as="div"
        by="slug"
        value={controller.field.value}
        onChange={controller.field.onChange}
        onBlur={controller.field.onBlur}
        disabled={disabled}
      >
        <div className="grid grid-cols-1 gap-8">
          {filteredPaymentMethods.map((item) => (
            <Radio
              key={item.name}
              value={item}
              disabled={disabled}
              className={({ disabled }) =>
                cx('flex w-full items-start', disabled ? 'opacity-50' : '')
              }
            >
              {({ checked, focus, disabled }) => (
                <>
                  <div
                    className={cx(
                      'duration-200 flex-none mr-2 -bottom-[1px] relative flex h-4.5 w-4.5 rounded-full border-2',
                      disabled ? 'bg-gray-100' : 'bg-white',
                      checked ? 'border-project-primary' : 'border-project',
                    )}
                  >
                    <div
                      className={cx(
                        'h-2 w-2 rounded-full top-1 left-1 bg-project-primary m-auto duration-200',
                        checked ? 'opacity-100' : 'opacity-0',
                        focus ? '!bg-project-primary/50 opacity-100' : '',
                      )}
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm pl-1">
                      <Label
                        as="p"
                        className={cx(
                          'font-medium text-gray-900 text-lg -mt-1',
                          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                        )}
                      >
                        {item.name}
                      </Label>
                      {item.description ? (
                        <Description as="div">
                          <div className="mt-1 block text-gray-500">
                            {item.slug === OrderPaymentMethodsSlugs.BY_CARD ? (
                              <>
                                <p>{item.description}</p>

                                <a
                                  href="https://www.comgate.cz/"
                                  className="mt-3 inline-block p-1.5 bg-white rounded-project shadow-lg border border-gray-100"
                                  title="Zprostředkovatel plateb je comgate.cz"
                                  target="_blank"
                                >
                                  <Image
                                    alt="Comgate logo"
                                    width={100}
                                    height={24}
                                    src="https://www.comgate.cz/files/logo-web-280.png"
                                  />
                                </a>
                              </>
                            ) : (
                              item.description
                            )}
                          </div>
                        </Description>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>

      {controller.fieldState.error?.message ? (
        <ErrorMessage>{controller.fieldState.error?.message}</ErrorMessage>
      ) : null}
    </>
  );
};
