'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Alert, Button, Input } from '@najit-najist/ui';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();

  return (
    <>
      <div className="text-7xl text-yellow-400 opacity-25 font-semibold absolute left-0 bottom-0">
        WORK IN PROGRESS / PŘIPRAVUJEME
      </div>
      <div className="max-w-lg w-full m-auto space-y-5">
        {params?.has('invalid') ? (
          <Alert color="error" heading="Nesprávný kód" />
        ) : null}
        <form
          method="POST"
          action="/unauthorized-preview-post"
          className="bg-white p-5 border-2 border-gray-100 space-y-5 rounded-lg flex w-full space-x-5"
        >
          <Input
            label="Přístupový kód"
            size="md"
            rootClassName="w-full"
            name="code"
          />
          <Button type="submit" className="flex-none !px-3" appearance="small">
            <ArrowRightIcon className="w-8 h-8" />{' '}
          </Button>
        </form>
      </div>
    </>
  );
}
