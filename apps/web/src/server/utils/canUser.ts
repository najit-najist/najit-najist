import {
  User,
  UserRoles,
  posts,
  products,
  recipes,
} from '@najit-najist/database/models';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

export enum UserActions {
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
  VIEW = 'view',
}

export enum SpecialSections {
  OG_PREVIEW = 'og-preview',
}

export type CanUserOptions = {
  action: UserActions;
  onModel: PgTableWithColumns<any> | SpecialSections;
};

class ActionsMap extends Map<
  PgTableWithColumns<any> | SpecialSections,
  Partial<Record<UserActions, boolean>> | boolean
> {}

export type RuleSet = Record<
  (typeof UserRoles)[keyof typeof UserRoles],
  ActionsMap | boolean
>;

const ruleSet: RuleSet = {
  [UserRoles.ADMIN]: true,
  [UserRoles.NORMAL]: new ActionsMap([
    [
      posts,
      {
        [UserActions.VIEW]: true,
      },
    ],
    [
      recipes,
      {
        [UserActions.VIEW]: true,
      },
    ],
    [
      products,
      {
        [UserActions.VIEW]: true,
      },
    ],
    [
      SpecialSections.OG_PREVIEW,
      {
        [UserActions.VIEW]: true,
      },
    ],
  ]),
  [UserRoles.BASIC]: new ActionsMap([
    [
      posts,
      {
        [UserActions.VIEW]: true,
      },
    ],
    [
      recipes,
      {
        [UserActions.VIEW]: true,
      },
    ],
    [
      products,
      {
        [UserActions.VIEW]: true,
      },
    ],
  ]),
  [UserRoles.PREMIUM]: false,
};

/**
 * Checks if provided user can or cannot do certain actions on model
 */

function canUser(
  user: Pick<User, 'role'>,
  method: CanUserOptions['action'],
  optionsOrModel: CanUserOptions['onModel'],
): boolean;
function canUser(user: Pick<User, 'role'>, options: CanUserOptions): boolean;
function canUser(
  user: Pick<User, 'role'>,
  optionsOrMethod: CanUserOptions | UserActions,
  model?: CanUserOptions['onModel'],
) {
  const modelsForRole = ruleSet[user.role];

  if (typeof modelsForRole === 'boolean') {
    return modelsForRole;
  }

  const modelRules =
    modelsForRole.get(
      typeof optionsOrMethod === 'object' ? optionsOrMethod.onModel : model!,
    ) ?? false;

  if (typeof modelRules === 'boolean') {
    return modelRules;
  }

  return (
    modelRules[
      typeof optionsOrMethod === 'object'
        ? optionsOrMethod.action
        : optionsOrMethod
    ] ?? false
  );
}

export { canUser };
