import {
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
  X_REQUEST_PATH_HEADER_NAME,
} from '@constants';
import { canUser, SpecialSections, User, UserActions } from '@najit-najist/api';
import { AuthService, getLoggedInUser } from '@najit-najist/api/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export const metadata = {
  title: 'Speciál pro Vás',
};

export default async function Page() {
  let user: User;

  try {
    await AuthService.authPocketBase();

    user = await getLoggedInUser();

    if (
      !canUser(user, {
        action: UserActions.VIEW,
        onModel: SpecialSections.OG_PREVIEW,
      })
    ) {
      throw new Error('User with this role cannot view this');
    }

    AuthService.clearAuthPocketBase();
  } catch (error) {
    console.log({ error });

    const redirectTo = headers().get(X_REQUEST_PATH_HEADER_NAME);
    redirect(`/login?${LOGIN_THEN_REDIRECT_TO_PARAMETER}=${redirectTo}`);
  }

  return (
    <>
      <div className="container text-center">
        <h1 className="text-5xl text-deep-green-400 mt-20 font-semibold font-title">
          Děkujeme za Vaší přízeň!
        </h1>
        <p className="text-lg mt-5 max-w-4xl mx-auto">
          Připravili jsme pro Vás speciální video v podobě rozhovoru s našim
          poradcem pro oblast výživy a zdraví s paní{' '}
          <Link
            href="https://www.mahuba.cz/"
            target="_blank"
            className="text-deep-green-300 hover:underline"
          >
            Mgr. Martou Hubačovou
          </Link>
          . Chceme Vám nastínit, jak a s kým budou naše odborné semináře
          probíhat, jaké informace můžete očekávat a určitě Vám dáme i možnost
          pokládat otázky při Online přenosech. Hodně věcí je i pro nás nových a
          chceme Vám slíbit, že se budeme neustále zlepšovat. Zaměřte se na
          informace, které se Vám snažíme předat. Zřejmě budete mít pocit, že
          chápete trochu víc PROČ, ale nepředali jsme Vám to JAK s tím naložit a
          CO dělat. Brzy zpřístupníme dokument od našeho specialisty, který si
          můžete stáhnout a v klidu několikrát přečíst, tam najdete některé
          návody CO dělat. A tak krok za krokem Vám budeme pomáhat hledat tu
          Vaší cestu… a vlastně o tom je celý náš projekt. Děkujeme za Váš zájem
          a důvěru.
        </p>
      </div>

      <div className="container mt-10">
        <video
          poster="/images/video-thumbnail.jpg"
          width="100%"
          className="sm:aspect-video bg-black relative shadow-lg shadow-green-600"
          controls
          controlsList="nodownload"
        >
          <source src="/api/videos/bonus" type="video/webm" />
          <source src="/api/videos/bonus?type=mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
}
