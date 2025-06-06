'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/form/Input';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

import { initiateSecretSession } from './_action';

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
          // @ts-ignore
          action={initiateSecretSession}
          className="bg-white p-5 border-2 border-gray-100 space-y-5 rounded-project flex w-full space-x-5"
        >
          <Input
            label="Přístupový kód"
            size="md"
            rootClassName="w-full"
            name="code"
          />
          <Button type="submit" className="flex-none !px-3" size="sm">
            <ArrowRightIcon className="w-8 h-8" />{' '}
          </Button>
        </form>
      </div>
    </>
  );
}
