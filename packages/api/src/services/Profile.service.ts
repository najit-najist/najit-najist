import { database } from '@najit-najist/database';
import {
  User,
  UserRoles,
  UserStates,
  users,
} from '@najit-najist/database/models';
import {
  PasswordReset,
  WelcomeAndFinish,
  renderAsync,
} from '@najit-najist/email-templates';
import { eq } from 'drizzle-orm';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import crypto from 'node:crypto';
import { z } from 'zod';

import { config } from '../config';
import { userRegisterInputSchema } from '../schemas/userRegisterInputSchema';
import { logger } from '../server';
import { MailService } from './Mail.service';
import { UserService, UserWithRelations } from './UserService';

type PasswordResetPaylod = {
  userId: User['id'];
};

const jwtVerifyOptions = {
  issuer: 'najitnajist.cz',
};

export class ProfileService {
  private forUser: UserWithRelations;

  constructor(forUser: UserWithRelations) {
    this.forUser = forUser;
  }

  async finalizeRegistration(token: string) {
    if (this.forUser.status !== UserStates.INVITED) {
      throw new Error('Váš účet je již aktivován');
    }
  }

  async resetPassword() {
    if (
      this.forUser.status !== UserStates.ACTIVE &&
      this.forUser.status !== UserStates.PASSWORD_RESET
    ) {
      throw new Error(
        'Váš účet nemůže resetovat heslo jelikož není dokončená registrace nebo byl Váš účet zablokován'
      );
    }

    const tokenSecret = crypto.randomBytes(10).toString('hex') + Date.now();
    const token = jwt.sign(
      {
        userId: this.forUser.id,
      } satisfies PasswordResetPaylod,
      tokenSecret,
      { expiresIn: '1d', ...jwtVerifyOptions }
    );
    const emailContent = await renderAsync(
      PasswordReset({
        siteOrigin: config.app.origin,
        token,
      })
    );

    await database
      .transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            _passwordResetSecret: tokenSecret,
            status: UserStates.PASSWORD_RESET,
          })
          .where(eq(users.id, this.forUser.id));

        await MailService.send({
          to: this.forUser.email,
          subject: `Obnova hesla na najitnajist.cz`,
          body: emailContent,
        });
      })
      .catch((error) => {
        logger.error(
          { error, userId: this.forUser.id },
          'Failed to init reset user password'
        );

        throw error;
      });
  }

  static async getUserForPasswordResetToken(token: string) {
    const { userId } = jwtDecode<PasswordResetPaylod>(token);
    const user = await UserService.forUser({ id: userId });
    const secret = user.getFor()._passwordResetSecret;

    if (!secret) {
      throw new Error('User has no reset secret');
    }

    await new Promise((resolve, reject) =>
      jwt.verify(token, secret, jwtVerifyOptions, (error) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(true);
      })
    );

    return new ProfileService(user.getFor());
  }

  async finalizePasswordReset(newPassword: string) {
    if (this.forUser.status !== UserStates.PASSWORD_RESET) {
      throw new Error('Váš účet není ve stavu obnovy hesla');
    }

    await (
      await UserService.forUser(this.forUser)
    ).update({
      status: UserStates.ACTIVE,
      _password: newPassword,
      _passwordResetSecret: null,
    });
  }

  static forUser(user: UserWithRelations) {
    return new ProfileService(user);
  }

  static async registerOne(input: z.infer<typeof userRegisterInputSchema>) {
    const tokenSecret = crypto.randomBytes(10).toString('hex') + Date.now();

    const user = await UserService.create({
      _password: input.password,
      ...input,
      role: UserRoles.BASIC,
      status: UserStates.INVITED,
      avatar: input.avatar ?? null,
      address: {
        municipalityId: input.address.municipality.id,
      },
      _registerSecret: tokenSecret,
    });

    const token = jwt.sign(
      {
        userId: user.id,
      } satisfies PasswordResetPaylod,
      tokenSecret,
      { expiresIn: '2d', ...jwtVerifyOptions }
    );

    try {
      const emailContent = await renderAsync(
        WelcomeAndFinish({
          siteOrigin: config.app.origin,
          token,
        })
      );

      await MailService.send({
        to: user.email,
        subject: `Dokončení registrace na najitnajist.cz`,
        body: emailContent,
      });

      return user;
    } catch (error) {
      await database.delete(users).where(eq(users.id, user.id));

      throw error;
    }
  }

  static async getOneUserForRegisterToken(token: string) {
    const { userId } = jwtDecode<PasswordResetPaylod>(token);
    const user = await UserService.forUser({ id: userId });
    const secret = user.getFor()._registerSecret;

    if (!secret) {
      throw new Error('User has no register secret');
    }

    await new Promise((resolve, reject) =>
      jwt.verify(token, secret, jwtVerifyOptions, (error) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(true);
      })
    );

    return new ProfileService(user.getFor());
  }

  async finishRegistration() {
    if (
      this.forUser.status !== UserStates.INVITED &&
      this.forUser.status !== UserStates.SUBSCRIBED
    ) {
      throw new Error('Váš účet není ve stavu předregistrace');
    }

    await (
      await UserService.forUser(this.forUser)
    ).update({
      status: UserStates.ACTIVE,
      _registerSecret: null,
    });
  }
}