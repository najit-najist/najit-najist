import { User, UserRoles } from '@custom-types';

export enum UserActions {
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
  VIEW = 'view',
}

export enum AvailableModels {
  USER = 'users',
  POST = 'posts',
  RECIPES = 'recipes',
}

export type CanUserOptions = {
  action: UserActions;
  onModel: AvailableModels;
};

export type RuleSet = Record<
  UserRoles,
  | Partial<
      Record<AvailableModels, Partial<Record<UserActions, boolean>> | boolean>
    >
  | boolean
>;

const ruleSet: RuleSet = {
  [UserRoles.ADMIN]: true,
  [UserRoles.NORMAL]: {
    [AvailableModels.POST]: {
      [UserActions.VIEW]: true,
    },
    [AvailableModels.USER]: false,
  },
  [UserRoles.PREMIUM]: false,
};

/**
 * Checks if provided user can or cannot do certain actions on model
 */
export const canUser = (
  user: Pick<User, 'role'>,
  options: CanUserOptions,
  customRuleSet = ruleSet
) => {
  const modelsForRole = customRuleSet[user.role];

  if (typeof modelsForRole === 'boolean') {
    return modelsForRole;
  }

  const modelRules = modelsForRole[options.onModel] ?? false;

  if (typeof modelRules === 'boolean') {
    return modelRules;
  }

  return modelRules[options.action] ?? false;
};
