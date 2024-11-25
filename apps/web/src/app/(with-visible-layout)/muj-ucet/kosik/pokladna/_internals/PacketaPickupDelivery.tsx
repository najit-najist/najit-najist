import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Skeleton } from '@components/common/Skeleton';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { TruckIcon } from '@heroicons/react/24/outline';
import {
  PacketaPoint,
  PacketaPointError,
  getPacketaScriptUrl,
} from '@najit-najist/packeta';
import Image from 'next/image';
import Script from 'next/script';
import { FC, useState } from 'react';
import { useController } from 'react-hook-form';

import { FormValues } from './types';

const packetaScriptUrl = getPacketaScriptUrl().toString();
const packetaErrorToMessage: Record<PacketaPointError, string> = {
  [PacketaPointError.CLOSING]: 'Toto odběrné místo bude brzy zavřeno.',
  [PacketaPointError.FULL]: 'Toto odběrné místo je přeplněno.',
  [PacketaPointError.OTHER]: 'Stala sa technická chyba.',
  [PacketaPointError.TECHNICAL]: 'Stala sa technická chyba.',
  [PacketaPointError.VACAY]: 'Toto odběrné je zavřené kvůli dovolené.',
};

export const PacketaPickupDelivery: FC = () => {
  const { field, fieldState, formState } = useController<
    Pick<FormValues, 'deliveryMethod'> & {
      deliveryMethod: {
        meta: PacketaPoint;
      };
    },
    'deliveryMethod.meta'
  >({
    name: 'deliveryMethod.meta',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const divider = <hr className="my-3 bg-gray-300 border-yellow-300 h-0.5" />;
  const isDisabled = formState.isSubmitSuccessful || formState.isSubmitting;
  const fieldError = fieldState.error?.message;
  const fieldValue =
    field.value !== null && typeof field.value !== 'string'
      ? field.value
      : null;

  return (
    <>
      <Script
        id="packeta-widget"
        src={packetaScriptUrl}
        onReady={() => {
          setIsLoaded(true);
        }}
      />
      <hr className="mt-8 mb-5 border-t border-gray-200" />
      <Alert
        className="w-full"
        heading={
          <>
            Vybrání místa vyzvednutí
            {fieldError || fieldValue?.error ? (
              <ExclamationTriangleIcon
                className="w-4 h-4 inline-block ml-2 text-red-500"
                title="Upravte nebo dokončete výběr"
              />
            ) : null}
          </>
        }
        color="warning"
        icon={TruckIcon}
      >
        {isLoaded ? (
          <>
            {!fieldValue ? (
              <p>
                Vyberte místo vyzvednutí, které je potřebné pro dokončení
                objednávky s vybraným zpúsobem dopravy Zásilkovna.
              </p>
            ) : (
              <>
                {divider}
                <p className="font-bold text-lg font-suez">{fieldValue.name}</p>
                <div className="mt-4">
                  {fieldValue.photo.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 w-full gap-2 mb-5">
                      {fieldValue.photo.map(({ normal, thumbnail }) => (
                        <div
                          className="relative aspect-square overflow-hidden rounded-md"
                          key={normal}
                        >
                          <Image
                            key={normal}
                            alt={fieldValue.name}
                            src={normal}
                            width={200}
                            height={400}
                            unoptimized
                            blurDataURL={thumbnail}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {divider}
                  <div className="w-full sm:flex gap-6">
                    <div
                      className="flex-none prose text text-current"
                      dangerouslySetInnerHTML={{
                        __html: fieldValue.openingHours.tableLong,
                      }}
                    ></div>
                    <div className="mt-2">
                      {fieldValue.directions ? (
                        <>
                          <div
                            className="prose-sm"
                            dangerouslySetInnerHTML={{
                              __html: fieldValue.directions,
                            }}
                          ></div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-2 mt-4 items-center">
              <Button
                color={fieldError || fieldValue?.error ? 'red' : 'sweet'}
                disabled={!process.env.NEXT_PUBLIC_PACKETA_KEY || isDisabled}
                isLoading={formState.isSubmitting}
                onClick={() =>
                  window.Packeta?.Widget.pick(
                    process.env.NEXT_PUBLIC_PACKETA_KEY!,
                    field.onChange,
                    { language: 'cs' },
                  )
                }
              >
                {fieldValue ? 'Změnit místo odběru' : 'Vybrat místo vyzvednutí'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Skeleton className="w-full h-11" />
            <Skeleton className="mt-4 h-9 max-w-60" />
          </>
        )}
        {fieldError ? (
          <ErrorMessage className="mt-2 block">
            <ExclamationTriangleIcon className="w-4 h-4 inline-block mr-2" />
            {fieldError}
          </ErrorMessage>
        ) : null}
        {fieldValue?.error ? (
          <ErrorMessage className="mt-2 block">
            <ExclamationTriangleIcon className="w-4 h-4 inline-block mr-2" />
            {packetaErrorToMessage[fieldValue?.error] ??
              packetaErrorToMessage[PacketaPointError.TECHNICAL]}{' '}
            Vyberte jiné místo.
          </ErrorMessage>
        ) : null}
      </Alert>
    </>
  );
};
