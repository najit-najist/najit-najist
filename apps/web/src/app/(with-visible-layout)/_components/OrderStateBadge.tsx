import { Badge, BadgeProps } from '@components/common/Badge';
import { Order, OrderState } from '@najit-najist/database/models';
import { FC } from 'react';

const DEFAULT_COLOR: NonNullable<BadgeProps['color']> = 'gray';

const orderStateToLabel: Record<OrderState, string> = {
  confirmed: 'Potvrzeno',
  dropped: 'Zrušeno',
  finished: 'Dokončeno 🎉',
  new: 'Vytvořeno',
  unconfirmed: 'Nepotvrzeno',
  unpaid: 'Nezaplaceno',
  shipped: 'Odesláno',
};

const orderStateToColor: Partial<
  Record<OrderState, NonNullable<BadgeProps['color']>>
> = {
  dropped: 'red',
  confirmed: 'blue',
  finished: 'green',
  new: 'gray',
  shipped: 'indigo',
  unconfirmed: 'yellow',
  unpaid: 'pink',
};

export const OrderStateBadge: FC<{ state: Order['state'] }> = ({ state }) => {
  return (
    <Badge color={orderStateToColor[state] ?? DEFAULT_COLOR}>
      {orderStateToLabel[state]}
    </Badge>
  );
};
