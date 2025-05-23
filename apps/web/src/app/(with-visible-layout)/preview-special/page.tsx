import {
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
  X_REQUEST_PATH_HEADER_NAME,
} from '@constants';
import { SpecialSections, UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Speciál pro Vás',
};

export default async function Page() {
  let user: Awaited<ReturnType<typeof getCachedLoggedInUser>> | undefined;

  try {
    user = await getCachedLoggedInUser();

    if (
      !user ||
      !canUser(user, {
        action: UserActions.VIEW,
        onModel: SpecialSections.OG_PREVIEW,
      })
    ) {
      throw new Error('User with this role cannot view this');
    }
  } catch (error) {
    console.log({ error });
    const awaitedHeader = await headers();

    const redirectTo = awaitedHeader.get(X_REQUEST_PATH_HEADER_NAME);
    redirect(`/login?${LOGIN_THEN_REDIRECT_TO_PARAMETER}=${redirectTo}`);
  }

  return (
    <>
      <div className="container text-center">
        <h1 className="text-5xl text-project-primary mt-20 font-semibold font-title">
          Děkujeme za Vaší přízeň!
        </h1>
        <p className="text-lg mt-5 max-w-4xl mx-auto">
          Připravili jsme pro Vás speciální video v podobě rozhovoru s našim
          poradcem pro oblast výživy a zdraví s paní{' '}
          <b>
            <Link
              href="https://www.mahuba.cz/"
              target="_blank"
              className="text-project-accent hover:underline"
            >
              Mgr. Martou Hubačovou
            </Link>
          </b>
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
          className="sm:aspect-video bg-black relative shadow-lg shadow-project-accent rounded-project"
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
