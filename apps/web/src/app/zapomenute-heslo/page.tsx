import { BottomLinks } from './_components/BottomLInks';
import { Form } from './_components/Form';
import { Title } from './_components/Title';

export const metadata = {
  title: 'Změna hesla',
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-col container justify-center w-full py-10">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-5 px-4 shadow rounded-project sm:px-5">
          <Form />
        </div>
        <BottomLinks />
      </div>
    </div>
  );
}
