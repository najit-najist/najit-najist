'use server';

import { logger } from '@logger/server';
import { userAddressUpdateInputSchema } from '@server/schemas/userAddressUpdateInputSchema';
import { UserService } from '@server/services/UserService';
import { getLoggedInUser } from '@server/utils/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const updateMyAddressAction = async (
  address: z.infer<typeof userAddressUpdateInputSchema>,
): Promise<{ message: string; errors?: Record<string, string[]> }> => {
  const user = await getLoggedInUser().catch(() => undefined);

  if (!user) {
    redirect('/login');
  }

  const validatedAddress = userAddressUpdateInputSchema.safeParse(address);

  if (!validatedAddress.success) {
    return {
      message: 'Některé políčka nejsou správně zadány',
      errors: validatedAddress.error.flatten().fieldErrors,
    };
  }

  try {
    await new UserService(user).update({
      address: validatedAddress.data,
    });

    return {
      message: 'Vaše adresa je uložená',
    };
  } catch (error) {
    logger.error({ error }, 'Failed to update user address');

    return {
      errors: {},
      message:
        error instanceof Error ? error.message : 'Stala se neočekávaná chyba',
    };
  }

  // revalidatePath('/muj-ucet/profil');
  // redirect('/muj-ucet/profil');
};
