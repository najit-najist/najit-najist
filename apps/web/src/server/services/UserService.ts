import { ToCreateSchema } from '@custom-types/ToCreateSchema';
import { database } from '@najit-najist/database';
import { eq, getTableName } from '@najit-najist/database/drizzle';
import {
  Municipality,
  TelephoneNumber,
  User,
  UserAddress,
  UserNewsletter,
  telephoneNumbers,
  userAddresses,
  userNewsletters,
  users,
} from '@najit-najist/database/models';
import { EntityLink, isFileBase64 } from '@najit-najist/schemas';

import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { LibraryService } from './LibraryService';
import { PasswordService } from './Password.service';

export type UserWithRelations = User & {
  telephone?: TelephoneNumber | null;
  address?: (UserAddress & { municipality: Municipality }) | null;
  newsletter: UserNewsletter | null;
};

type Address = Omit<ToCreateSchema<UserAddress>, 'userId'>;

export type UserServiceCreateOptions = Omit<
  ToCreateSchema<User>,
  'lastLoggedIn' | 'telephoneId' | '_passwordResetSecret' | '_registerSecret'
> & {
  newsletter?: boolean | null;
  lastLoggedIn?: User['lastLoggedIn'];
  telephoneId?: User['telephoneId'];
  _passwordResetSecret?: User['_passwordResetSecret'];
  _registerSecret?: User['_registerSecret'];
  telephone?: Pick<TelephoneNumber, 'telephone'>;
  address: Pick<Address, 'municipalityId'> &
    Partial<Omit<Address, 'municipalityId'>>;
};

export type UserServiceUpdateOptions = Omit<
  Partial<UserServiceCreateOptions>,
  'address'
> & {
  address?: Partial<UserServiceCreateOptions['address']>;
};

export class UserService {
  private forUser: UserWithRelations;

  constructor(user: UserWithRelations) {
    this.forUser = user;
  }

  getFor() {
    return this.forUser;
  }

  async update(updateOptions: UserServiceUpdateOptions) {
    const library = new LibraryService(users);

    try {
      library.beginTransaction();

      const updated = await database.transaction(async (tx) => {
        const { newsletter, address, _password, ...updatePayload } =
          updateOptions;

        if (updatePayload.avatar) {
          if (!isFileBase64(updatePayload.avatar)) {
            updatePayload.avatar = undefined;
          } else {
            const { filename: newAvatarFilename } = await library.create(
              this.forUser,
              updatePayload.avatar,
            );

            updatePayload.avatar = newAvatarFilename;

            if (this.forUser.avatar) {
              await library.delete(this.forUser, this.forUser.avatar);
            }
          }
        }

        if (updatePayload.telephone) {
          const { telephone: existingTelephone } = this.forUser;

          if (!existingTelephone) {
            const [created] = await tx
              .insert(telephoneNumbers)
              .values({
                code: '420',
                telephone: updatePayload.telephone.telephone,
              })
              .returning();

            updatePayload.telephoneId = created.id;
          } else {
            await tx
              .update(telephoneNumbers)
              .set({
                telephone: updatePayload.telephone.telephone,
              })
              .where(eq(telephoneNumbers.id, existingTelephone.id));

            delete updatePayload.telephone;
          }
        }

        if (address) {
          await tx
            .update(userAddresses)
            .set(address)
            .where(eq(userAddresses.id, this.forUser.id));
        }

        const [updated] = await tx
          .update(users)
          .set({
            ...updatePayload,
            ...(_password
              ? { _password: await PasswordService.hash(_password) }
              : {}),
            updatedAt: new Date(),
          })
          .where(eq(users.id, this.forUser.id))
          .returning();

        if (typeof newsletter === 'boolean') {
          const existingNewsletter = await tx.query.userNewsletters.findFirst({
            where: eq(userNewsletters.email, updated.email),
          });
          if (existingNewsletter) {
            await tx
              .update(userNewsletters)
              .set({
                enabled: newsletter,
              })
              .where(eq(userNewsletters.email, updated.email));
          } else {
            await tx
              .insert(userNewsletters)
              .values({ email: updated.email, enabled: newsletter });
          }
        }

        await library.commit();

        return updated;
      });

      return updated;
    } catch (error) {
      // Delete new avatar if something fails
      library.endTransaction();

      throw error;
    }
  }

  static async create(options: UserServiceCreateOptions) {
    const library = new LibraryService(users);

    try {
      await database.transaction(async (tx) => {
        library.beginTransaction();

        const {
          avatar: newAvatar,
          telephone: newTelephone,
          address: newAddress,
          newsletter,
          _password,
          ...createOptions
        } = options;
        const [created] = await tx
          .insert(users)
          .values({
            ...createOptions,
            _password: await PasswordService.hash(_password),
          })
          .returning();

        const postCreateUpdatePayload: Partial<User> = {};

        await tx.insert(userAddresses).values({
          ...newAddress,
          userId: created.id,
        });

        if (newAvatar) {
          const { filename: newAvatarFilename } = await library.create(
            {
              id: created.id,
            },
            newAvatar,
          );

          postCreateUpdatePayload.avatar = newAvatarFilename;
        }

        const telephoneNumber = options.telephone?.telephone;
        if (telephoneNumber) {
          let existing = await tx.query.telephoneNumbers.findFirst({
            where: (schema, { eq }) => eq(schema.telephone, telephoneNumber),
          });

          if (!existing) {
            [existing] = await tx
              .insert(telephoneNumbers)
              .values({
                code: '420',
                telephone: telephoneNumber,
              })
              .returning();
          }

          postCreateUpdatePayload.telephoneId = existing.id;
        }

        if (Object.keys(postCreateUpdatePayload).length) {
          await tx
            .update(users)
            .set(postCreateUpdatePayload)
            .where(eq(users.id, created.id));
        }

        if (typeof newsletter === 'boolean') {
          const existingNewsletter = await tx.query.userNewsletters.findFirst({
            where: eq(userNewsletters.email, created.email),
          });
          if (existingNewsletter) {
            await tx
              .update(userNewsletters)
              .set({
                enabled: newsletter,
              })
              .where(eq(userNewsletters.email, created.email));
          } else {
            await tx
              .insert(userNewsletters)
              .values({ email: created.email, enabled: newsletter });
          }
        }

        await library.commit();
      });

      return await UserService.getOneBy('email', options.email);
    } catch (error) {
      library.endTransaction();

      throw error;
    }
  }

  static async queryOneBy<
    T extends NonNullable<
      NonNullable<
        Parameters<typeof database.query.users.findFirst>['0']
      >['where']
    >,
  >(where: T): Promise<UserWithRelations | undefined> {
    return await database.query.users.findFirst({
      where,
      with: {
        telephone: true,
        address: {
          with: { municipality: true },
        },
        newsletter: true,
      },
    });
  }

  static async getOneBy<V extends keyof User>(
    by: V,
    value: User[V],
  ): Promise<UserWithRelations> {
    const item = await this.queryOneBy((schema, { eq }) =>
      eq(schema[by], value as any),
    );

    if (!item) {
      throw new EntityNotFoundError({
        entityName: getTableName(users),
      });
    }

    return item;
  }

  static forUserSync(user: UserWithRelations) {
    return new UserService(user);
  }

  static async forUser(
    link: EntityLink | Pick<UserWithRelations, 'email'> | UserWithRelations,
  ) {
    return new UserService(
      Object.keys(link).length > 1 && 'id' in link
        ? (link as UserWithRelations)
        : 'id' in link
          ? await this.getOneBy('id', link.id)
          : await this.getOneBy('email', link.email),
    );
  }
}
