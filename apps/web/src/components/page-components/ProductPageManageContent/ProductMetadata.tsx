import { ProductWithRelationsLocal } from '@custom-types/index';
import { FC, Fragment, ReactNode } from 'react';

export const ProductMetadata: FC<
  Pick<ProductWithRelationsLocal, 'stock' | 'limitedToDeliveryMethods'>
> = ({ stock, limitedToDeliveryMethods }) => {
  const rows = new Map<string, ReactNode>();

  if (stock && stock.value > 0) {
    rows.set(
      'stocked',
      <li className="text-project-primary font-semibold">
        Produkt máme skladem 🎉
      </li>,
    );
  } else if (!stock) {
    rows.set(
      'unstocked-prepared',
      <li className="text-orange-400">⏳ Produkt pouze na objednávku!</li>,
    );
  }

  if (limitedToDeliveryMethods.length) {
    rows.set(
      'delivery-methods-note',
      <li className="text-orange-400">
        {limitedToDeliveryMethods.length === 1 ? (
          <span>
            📦 Produkt pouze omezen na dopravu{' '}
            <span className="underline">
              {limitedToDeliveryMethods.at(0)?.deliveryMethod.name}
            </span>
          </span>
        ) : (
          <>
            📦 Produkt má omezenou dopravu:{' '}
            {limitedToDeliveryMethods.map((item, index) => {
              const index1 = index + 1;
              const isLast = index1 === limitedToDeliveryMethods.length;
              const isBeforeLast =
                index1 + 1 === limitedToDeliveryMethods.length;

              return (
                <span key={index}>
                  <span className="underline">{item.deliveryMethod.name}</span>
                  {isLast ? '' : isBeforeLast ? ' nebo ' : ', '}
                </span>
              );
            })}
          </>
        )}
      </li>,
    );
  }

  return (
    <ul className="text-base mt-4 list-disc pl-3 space-y-2">
      {[...rows].map(([key, value]) => (
        <Fragment key={key}>{value}</Fragment>
      ))}
    </ul>
  );
};
