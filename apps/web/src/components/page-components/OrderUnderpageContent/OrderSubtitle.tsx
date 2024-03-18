import { OrderState } from '@najit-najist/database/models';
import { isLocalPickup } from '@utils';
import { FC, ReactNode } from 'react';

import { OrderUnderpageProps } from './OrderUnderpageContent';

type MessagesDictionary = Record<OrderState, ReactNode>;

export const OrderSubtitle: FC<OrderUnderpageProps> = ({ order, viewType }) => {
  let contents: ReactNode = '';

  if (viewType === 'update') {
    const orderStateToSubtitle: MessagesDictionary = {
      confirmed: (
        <>
          Tato objednávka <b>#{order.id}</b> je potvrzená!{' '}
          {isLocalPickup(order.deliveryMethod) ? (
            <>
              Uživatel si vybral vyzvednutí na prodejně. Když bude vše hotové
              tak přepněte stav na <b>&apos;Připraveno v vyzvednutí&apos;</b>
            </>
          ) : (
            <>
              Nyní objednávku zabalte a předejte dopravci. Poté přepněte
              objednávku do stavu <b>&apos;Odesláno&apos;</b>.
            </>
          )}
        </>
      ),
      dropped: 'Tuto objednávku jsme zrušili',
      finished:
        'Tato objednávka byla dokončena a uživatel by ji měl mít již u sebe',
      new: 'Tato objednávka je pouze vytvořena a čeká na další akci',
      unconfirmed: (
        <>
          Tato objednávka je v nepotvrzeném stavu. Uživatel čeká na potvrzení z
          naší strany. Až bude vše v pořádku a připraveno na skladě tak
          objednávku přepněte do stavu <b>&apos;Potvrzeno&apos;</b>
        </>
      ),
      shipped: isLocalPickup(order.deliveryMethod) ? (
        <>
          Objednávka byla připravena na prodejně. Čekáme až si pro ni uživatel
          dorazí.
        </>
      ) : (
        <>
          Objednávka byla zabalena a odeslána. Čekáme na informaci od dopravce
          jestli balík dorazil. Pokud dorazil, ale systém tuto informaci
          nezaznamenal tak objednávku přepněte ručně
        </>
      ),
      unpaid: (
        <>
          Tato objednávka je vytvořena, ale nezaplacena. Čekáme na zaplacení
          objednávky od uživatele. Až uživatel zaplatí tak objednávku přepněte
          do stavu <b>&apos;Potvrzeno&apos;</b> nebo{' '}
          <b>&apos;Nepotvrzeno&apos;</b> pokud se tak již nestane automaticky
        </>
      ),
    };

    contents = orderStateToSubtitle[order.state];
  } else {
    const orderStateToSubtitle: MessagesDictionary = {
      confirmed: (
        <>
          Vaše objednávka <b>#{order.id}</b> je potvrzená!{' '}
          {isLocalPickup(order.deliveryMethod) ? (
            <>Již brzy dostanete info pro vyzvednutí!</>
          ) : (
            <>Nyní Vaši objednávku zabalíme a odešleme.</>
          )}
        </>
      ),
      shipped: (
        <>
          {isLocalPickup(order.deliveryMethod) ? (
            <>
              Vaše objednávka na Vás čeká na naší prodejně. Přijďte si pro ni!
            </>
          ) : (
            <>
              Objednávka byla zabalena a předána dopravci. O dalším průběhu Vás
              bude kontaktovat dopravce.
            </>
          )}
        </>
      ),
      dropped: 'Tato objednávka byla zrušena. Jak smutné 😢',
      finished:
        'Tato objednávka byla úspěšně dokončena a měli by jste ji mít už v rukou. Nezapomeňte na hodnocení!',
      new: 'Tato objednávka je pouze vytvořena a čeká na další akci',
      unconfirmed: `Blahopřejeme k vytvořené objednávky! Nyní počkejte na potvrzení dostupnosti z naší strany. Po potvrzení Vás budeme znovu kontaktovat.`,
      unpaid:
        'Tato objednávka je vytvořena, ale nezaplacena. Zaplaťte prosím objednávku, aby jsme s ní mohli pokračovat.',
    };

    contents = orderStateToSubtitle[order.state];
  }

  return <p className="mt-2 text-base text-gray-500">{contents}</p>;
};
