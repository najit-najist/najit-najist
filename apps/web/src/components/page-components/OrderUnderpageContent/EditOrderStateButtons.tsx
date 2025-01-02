'use client';

import { Button } from '@components/common/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Order } from '@najit-najist/database/models';
import { useMutation } from '@tanstack/react-query';
import { handlePromiseForToast } from '@utils/handleActionForToast';
import { updateOrderAction } from 'app/(with-visible-layout)/administrace/objednavky/[orderId]/updateAction';
import { useRouter } from 'next/navigation';
import { FC, MouseEventHandler, useCallback, useTransition } from 'react';
import { toast } from 'sonner';

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
  const { mutateAsync: doUpdate, isPending: isLoading } = useUpdate();
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

      toast.promise(handlePromiseForToast(updatePromise), {
        error: (error) => `Nemůžeme upravit objednávku: ${error.message}`,
        loading: 'Ukládám změny',
        success: 'Objednávka uložena, získávám aktuální data...',
      });

      await updatePromise;

      setIsDoingTransition(() => {
        router.refresh();
      });
    },
    [order.id, router, doUpdate],
  );

  return (
    <>
      {buttons.map((buttonConfig) => (
        <Button
          key={buttonConfig.text}
          data-next-state={buttonConfig.nextState}
          onClick={onButtonClickHandler}
          disabled={buttonsAreDisabled}
        >
          {buttonsAreDisabled ? 'Pracuji...' : buttonConfig.text}
        </Button>
      ))}
      <Button
        className="w-full max-w-60"
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
