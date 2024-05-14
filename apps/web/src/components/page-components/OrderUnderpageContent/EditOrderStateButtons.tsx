'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { Order } from '@najit-najist/database/models';
import { Button, toast } from '@najit-najist/ui';
import { useMutation } from '@tanstack/react-query';
import { updateOrderAction } from 'app/(with-visible-layout)/administrace/objednavky/[orderId]/updateAction';
import { useRouter } from 'next/navigation';
import { FC, MouseEventHandler, useCallback, useTransition } from 'react';

type OrderState = Order['state'];

export type ActiveButtonConfig = {
  nextState: OrderState;
  text: string;
  description?: string;
};

export type EditOrderStateButtonsProps = {
  buttons: ActiveButtonConfig[];
  order: Pick<Order, 'id'>;
};

const useUpdate = () =>
  useMutation({
    mutationFn: updateOrderAction,
  });

export const EditOrderStateButtons: FC<EditOrderStateButtonsProps> = ({
  buttons,
  order,
}) => {
  const [isDoingTransition, setIsDoingTransition] = useTransition();
  const { mutateAsync: doUpdate, isLoading } = useUpdate();
  const router = useRouter();
  const buttonsAreDisabled = isDoingTransition || isLoading;

  const onButtonClickHandler = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    async (event) => {
      const dataset = event.currentTarget.dataset;
      if (!confirm(dataset.message ?? 'Opravdu změnit stav?')) {
        return null;
      }

      const selectedNextState = dataset.nextState as undefined | OrderState;

      if (!selectedNextState) {
        throw new Error('Button does not have data-next-state property');
      }

      const updatePromise = doUpdate({
        id: order.id,
        payload: {
          state: selectedNextState,
        },
      });

      toast.promise(updatePromise, {
        error: (error) => `Nemůžeme upravit objednávku: ${error.message}`,
        loading: 'Ukládám změny',
        success: 'Objednávka uložena, získávám aktuální data...',
      });

      await updatePromise;

      setIsDoingTransition(() => {
        router.refresh();
      });
    },
    [order.id, router, doUpdate]
  );

  return (
    <>
      <div className="flex flex-col gap-2 mt-2">
        {buttons.map((buttonConfig) => (
          <Button
            key={buttonConfig.text}
            data-next-state={buttonConfig.nextState}
            onClick={onButtonClickHandler}
            appearance="small"
            color="white"
            disabled={buttonsAreDisabled}
          >
            {buttonsAreDisabled ? 'Pracuji...' : buttonConfig.text}
          </Button>
        ))}
      </div>
      <hr className="border-none bg-gray-100 h-0.5 my-3" />
      <Button
        className="w-full"
        color="red"
        icon={<TrashIcon className="w-4 h-4 inline -mt-1 mr-2" />}
        data-next-state="dropped"
        data-message="Opravdu zrušit objednávku?"
        disabled={buttonsAreDisabled}
        onClick={onButtonClickHandler}
      >
        Zrušit objednávku
      </Button>
    </>
  );
};
