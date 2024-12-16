import { Section } from '@components/portal';
import { getAuthorizedUserOrRequestLogin } from '@server/utils/getAuthorizedUserOrRequestLogin';

import { Addresses } from './Addresses';
import { FormProvider } from './FormProvider';
import { SaveButton } from './SaveButton';

export default async function MyProfileAddressPage() {
  const user = await getAuthorizedUserOrRequestLogin();

  return (
    <FormProvider
      initialData={{
        city: user.address?.city,
        houseNumber: user.address?.houseNumber,
        municipality: user.address?.municipality,
        postalCode: user.address?.postalCode,
        streetName: user.address?.streetName,
      }}
    >
      <Section>
        <div className="px-5 flex items-center justify-between mt-3">
          <h1 className="text-3xl font-title tracking-wide">Moje adresa</h1>
          <SaveButton />
        </div>
        <div className="px-5 pt-5 grid grid-cols-1 gap-3 pb-3">
          <Addresses />
        </div>
      </Section>
    </FormProvider>
  );
}
