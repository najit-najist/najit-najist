import { PageTitle } from '@components/common/PageTitle';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Form } from './_components/Form';

export const metadata = {
  title: 'Statické soubory',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <>
      <div className="container mt-5 -mb-5">
        <Link
          href="/administrace"
          className="text-red-400 hover:underline group"
        >
          <ArrowLeftIcon
            strokeWidth={3}
            className="w-4 h-4 inline-block relative -top-0.5 group-hover:-translate-x-1 mr-1 duration-100"
          />
          Zpět na rozcestník
        </Link>
      </div>
      <div className="container py-20">
        <PageTitle>{metadata.title}</PageTitle>
        <div className="flex flex-wrap gap-5 mt-5 divide-x-2 items-center justify-start">
          <Form />
        </div>
      </div>
    </>
  );
}
