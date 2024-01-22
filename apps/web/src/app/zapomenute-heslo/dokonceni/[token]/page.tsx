import { BottomLinks } from './components/BottomLinks';
import { Form } from './components/Form';
import { Title } from './components/Title';

export const metadata = {
  title: 'Dokončení změny hesla',
};

export default function Page({ params }: { params: { token: string } }) {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6">
          <Form token={params.token} />
        </div>
        <BottomLinks />
      </div>
    </div>
  );
}
