import { Badge, BadgeProps } from '@components/common/Badge';
import { Tooltip } from '@components/common/Tooltip';
import { FC } from 'react';

export const OnlyDeliveryMethodBadge: FC<{
  onlyDeliveryMethods: string[];
  size?: BadgeProps['size'];
}> = ({ onlyDeliveryMethods, size = 'lg' }) => {
  const hasJustOne = onlyDeliveryMethods.length === 1;

  return (
    <Tooltip
      color="warning"
      disabled={hasJustOne}
      trigger={
        <Badge
          size={size}
          color="yellow"
          className={hasJustOne ? '' : 'cursor-help'}
        >
          {hasJustOne ? (
            <>Pouze {onlyDeliveryMethods.at(0)}</>
          ) : (
            <>Omezená doprava</>
          )}
        </Badge>
      }
    >
      <div className="max-w-sm text-yellow-800 p-2">
        <p className="text-sm">Tento produkt má omezené možnosti dopravy:</p>
        <ul className="list-disc pl-5 text-sm">
          {onlyDeliveryMethods.map((item, index) => {
            const index1 = index + 1;
            const isLast = index1 === onlyDeliveryMethods.length;
            const isBeforeLast = index1 + 1 === onlyDeliveryMethods.length;
            let text = item;

            if (!isLast) {
              text += isBeforeLast ? ' nebo ' : ', ';
            }

            return <li key={index}>{text}</li>;
          })}
        </ul>
      </div>
    </Tooltip>
  );
};
