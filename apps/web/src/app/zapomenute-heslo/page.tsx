import { BottomLinks } from './_components/BottomLInks';
import { Form } from './_components/Form';
import { Title } from './_components/Title';

export const metadata = {
  title: 'Změna hesla',
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto w-full">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form />
        </div>
        <BottomLinks />
      </div>
    </div>
  );
}
