'use server';

import { logger } from '@logger/server';
import { IMAGE_FILE_REGEX } from '@najit-najist/schemas';
import { UserService } from '@server/services/UserService';
import { getLoggedInUser } from '@server/utils/server';
import { setFileNameToBase64 } from '@server/utils/setFileNameToBase64';
import { redirect } from 'next/navigation';
import sharp from 'sharp';

export const updateMyProfileImageAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string; success?: boolean; image?: string }> => {
  const user = await getLoggedInUser().catch(() => undefined);

  if (!user) {
    redirect('/login');
  }

  const nextImage = formData.get('image');
  if (!nextImage || nextImage instanceof File === false) {
    return {
      success: false,
      message: 'Stala se neočekávaná chyba',
    };
  }

  try {
    if (!IMAGE_FILE_REGEX.test(nextImage.type)) {
      return {
        success: false,
        message: 'Nevalidní formát nového profilového obrázku',
      };
    }

    const imageAsBuffer = await sharp(await nextImage.arrayBuffer())
      .resize(450, 450)
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
    const imageAsBase64 = imageAsBuffer.toString('base64');
    const imageAsBase64Url = setFileNameToBase64(
      `data:image/jpeg;base64,${imageAsBase64}`,
      `profilovy-obrazek-${user.id}.jpeg`,
    );

    await new UserService(user).update({
      avatar: imageAsBase64Url,
    });

    return {
      message: 'Váš nový profilový obrázek jsme uložili',
      image: imageAsBase64Url,
    };
  } catch (error) {
    logger.error({ error }, 'Failed to update user profile image');

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Stala se neočekávaná chyba',
    };
  }

  // revalidatePath('/muj-ucet/profil');
  // redirect('/muj-ucet/profil');
};
