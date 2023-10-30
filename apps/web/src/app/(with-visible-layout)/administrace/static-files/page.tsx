import { PageTitle } from '@components/common/PageTitle';
import { Form } from './_components/Form';

export const metadata = {
  title: 'Statické soubory',
};

export const revalidate = 0;

export default async function Page() {
  return (
    <div className="container py-20">
      <PageTitle>{metadata.title}</PageTitle>
      <div className="flex flex-wrap gap-5 mt-5 divide-x-2 items-center">
        <Form />
      </div>
    </div>
  );
}
