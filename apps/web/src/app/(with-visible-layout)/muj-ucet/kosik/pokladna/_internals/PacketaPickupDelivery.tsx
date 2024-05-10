import { TruckIcon } from '@heroicons/react/24/outline';
import { PacketaPoint, getPacketaScriptUrl } from '@najit-najist/packeta';
import {
  Alert,
  Button,
  ErrorMessage,
  FormBreak,
  Skeleton,
  Tooltip,
} from '@najit-najist/ui';
import Image from 'next/image';
import Script from 'next/script';
import { FC, useState } from 'react';
import { useController } from 'react-hook-form';

const packetaScriptUrl = getPacketaScriptUrl().toString();

export const PacketaPickupDelivery: FC = () => {
  const { field, fieldState } = useController<
    { packetaMetadata?: PacketaPoint | null },
    'packetaMetadata'
  >({
    name: 'packetaMetadata',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const divider = <hr className="my-3 bg-gray-300 border-yellow-300 h-0.5" />;

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
        heading="Vybrání místa vyzvednutí"
        color="warning"
        icon={TruckIcon}
      >
        {isLoaded ? (
          <>
            {!field.value ? (
              <p>
                Vyberte místo vyzvednutí, které je potřebné pro dokončení
                objednávky s vybraným zpúsobem dopravy Zásilkovna.
              </p>
            ) : (
              <>
                {divider}
                <p className="font-bold text-lg font-suez">
                  {field.value.name}
                </p>
                <div className="mt-4">
                  {field.value?.photo.length ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 w-full gap-2 mb-5">
                        {field.value.photo.map(({ normal, thumbnail }) => (
                          <div
                            className="relative aspect-square overflow-hidden rounded-md"
                            key={normal}
                          >
                            <Image
                              key={normal}
                              alt={field.value!.name}
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
                    </>
                  ) : null}
                  {divider}
                  <div className="w-full sm:flex gap-6">
                    <div
                      className="flex-none prose text text-current"
                      dangerouslySetInnerHTML={{
                        __html: field.value.openingHours.tableLong,
                      }}
                    ></div>
                    <div className="mt-2">
                      {field.value.directions ? (
                        <>
                          <div
                            className="prose-sm"
                            dangerouslySetInnerHTML={{
                              __html: field.value.directions,
                            }}
                          ></div>
                        </>
                      ) : null}
                      <Button
                        className="mt-4"
                        onClick={() =>
                          window.Packeta?.Widget.pick(
                            'fc9689802a8af27e',
                            field.onChange,
                            { language: 'cs' }
                          )
                        }
                      >
                        {field.value
                          ? 'Změnit místo odběru'
                          : 'Vybrat místo vyzvednutí'}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <Skeleton className="w-full h-24" />
        )}
        {fieldState.error ? (
          <ErrorMessage className="mt-2 block">
            {fieldState.error.message}
          </ErrorMessage>
        ) : null}
      </Alert>
    </>
  );
};
