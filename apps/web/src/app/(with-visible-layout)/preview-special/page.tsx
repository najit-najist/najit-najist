import {
  LOGIN_THEN_REDIRECT_TO_PARAMETER,
  X_REQUEST_PATH_HEADER_NAME,
} from '@constants';
import { canUser, SpecialSections, User, UserActions } from '@najit-najist/api';
import { AuthService, getLoggedInUser } from '@najit-najist/api/server';
import { headers } from 'next/headers';
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
      <div className="container">
        <h1 className="text-4xl text-deep-green-400 mt-20 font-semibold">
          Děkujeme za Vaší přízeň!
        </h1>
        <p className="text-lg mt-3 max-w-4xl">
          Připravili jsme pro Vás speciální video od naší specialistky na střevo
          a mikrobiom Martu Hubačovou. Toto video by Vám mělo posloužit jako
          úvod do naší práce, co pro Vás můžeme udělat a hlavně jako díky za Váš
          zájem v první fázi!
        </p>
      </div>

      <div className="container mt-10">
        <video
          width="100%"
          className="sm:aspect-video bg-black relative"
          controls
        >
          <source src="/api/videos/our-story" type="video/webm" />
          <source src="/api/videos/our-story?type=mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
}
