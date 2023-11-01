'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Alert, Button } from '@najit-najist/ui';
import Link from 'next/link';
import { FC } from 'react';
import { useCookie } from 'react-use';
import { PRODUCTS_NOTICE_STATE_COOKIE_NAME } from './_constants';

export const Notice: FC = () => {
  const [state, setCookieValue] = useCookie(PRODUCTS_NOTICE_STATE_COOKIE_NAME);

  if (state === 'true') {
    return;
  }

  return (
    <Alert
      icon={InformationCircleIcon}
      heading="Důležité informace"
      className="max-w-6xl mx-auto mt-5 shadow-lg"
    >
      <p className="leading-relaxed">
        Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete
        objednat a nechat připravit na prodejně. Jednoduše si vyberte ze
        seznamu, objednávku odešlete mailem z Vašeho registrovaného e-mailu na
        adresu{' '}
        <b>
          <Link
            href="maito:prodejnahk@najitnajist.cz"
            className="hover:underline"
          >
            prodejnahk@najitnajist.cz
          </Link>
        </b>{' '}
        nebo si vše objednejte a zaplaťte přímo v prodejně na ulici{' '}
        <b>Tomkova 1230/4a v Hradci Králové</b>. <br /> Do mailu zapište kód
        produktu, počet kusů a datum a přibližný čas vyzvednutí objednávky -
        např. B1, 2 ks, 26.9.2023 14:00 <br /> Seznam Produktů je zatím dostupný
        pouze pro registrované a tedy přihlášené uživatele, chceme vědět, komu
        budeme jídlo připravovat a v případě lehkého opomenutí koho kontaktovat.
        Objednávku do 200,- Kč můžete zaplatit v prodejně při vyzvednutí,
        objednávku nad 200,- Kč (např. na celý týden dopředu) uhraďte předem
        celkovou částku jedním převodním příkazem na účet{' '}
        <b>131-823110227 / 0100</b> a do zprávy pro příjemce uveďte registrovaný
        email.
      </p>
      <p className="leading-relaxed mt-2">
        Pracujeme na kompletním objednávkovém systému, kde si podobně vyberete z
        aktuálně dostupných produktů, zaškrtnete si vyhovující kombinaci, den a
        přibližný čas vyzvednutí objednávky a vše zaplatíte přes platební bránu.
      </p>
      <Button onClick={() => setCookieValue('true')} className="mt-4">
        Rozumím
      </Button>
    </Alert>
  );
};
