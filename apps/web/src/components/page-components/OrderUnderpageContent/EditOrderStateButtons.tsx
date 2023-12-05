'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { Order } from '@najit-najist/api';
import { Button, toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
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

export const EditOrderStateButtons: FC<EditOrderStateButtonsProps> = ({
  buttons,
  order,
}) => {
  const [isDoingTransition, setIsDoingTransition] = useTransition();
  const { mutateAsync: updateOrder, isLoading: isUpdatingOrder } =
    trpc.orders.update.useMutation();
  const router = useRouter();

  const buttonsAreDisabled = isDoingTransition || isUpdatingOrder;

  const onButtonClickHandler = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      const dataset = event.currentTarget.dataset;
      if (!confirm(dataset.message ?? 'Opravdu změnit stav?')) {
        return null;
      }

      const selectedNextState = dataset.nextState as undefined | OrderState;

      if (!selectedNextState) {
        throw new Error('Button does not have data-next-state property');
      }

      setIsDoingTransition(async () => {
        await toast.promise(
          updateOrder({
            id: order.id,
            payload: {
              state: selectedNextState,
            },
          }),
          {
            error: (error) => `Nemůžeme upravit objednávku: ${error.message}`,
            loading: 'Ukládám změny',
            success: 'Objednávka uložena',
          }
        );

        router.refresh();
      });
    },
    [order.id, router, updateOrder]
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
            {buttonConfig.text}
          </Button>
        ))}
      </div>
      <hr className="border-none bg-gray-100 h-0.5 my-3" />
      <Button
        className="w-full"
        color="red"
        icon={<TrashIcon className="w-4 h-4 inline -mt-1 mr-2" />}
        data-next-state={'dropped'}
        data-message="Opravdu zrušit objednávku?"
        onClick={onButtonClickHandler}
      >
        Zrušit objednávku
      </Button>
    </>
  );
};
