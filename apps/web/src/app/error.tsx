'use client';

import { Logo } from '@components/common/Logo';
import { footerNavigationItems } from '@components/layout/Footer';
import { logger } from '@logger/web';
import Link from 'next/link';
import { useEffect } from 'react';

const iconSize = 21;

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger?.error('Fatal error on web', {
      error,
    });
    if (!logger) {
      console.error({ error });
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="text-center">
        <Logo className="h-28 w-auto mx-auto" />
        <h2 className="text-4xl font-semibold mt-8 text-project-primary">
          Moc se omlouváme!
        </h2>
        <p className="mt-2">
          Na webu se stala neočekávaná chyba, ale již pilně pracujeme na její
          opravě.
        </p>

        <div className="flex gap-3 items-center justify-center mt-8">
          {footerNavigationItems.social.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon
                  width={(item.iconSize ?? iconSize) * 1.5}
                  height={(item.iconSize ?? iconSize) * 1.5}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
