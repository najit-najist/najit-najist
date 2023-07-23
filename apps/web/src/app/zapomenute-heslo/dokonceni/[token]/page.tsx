import { BottomLinks } from './components/BottomLinks';
import { Title } from './components/Title';
import { Form } from './components/Form';

export const metadata = {
  title: 'Dokončení změny hesla',
};

export default function Page({ params }: { params: { token: string } }) {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form token={params.token} />
        </div>
        <BottomLinks />
      </div>
    </div>
  );
}
