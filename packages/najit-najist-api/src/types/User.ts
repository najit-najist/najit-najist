export enum UserRoles {
  ADMIN = 'ADMIN',
  /**
   * @deprecated - use BASIC instead, this is for users that were registered through intro-web
   */
  NORMAL = 'NORMAL',
  PREMIUM = 'PREMIUM',
  BASIC = 'BASIC',
}

export enum UserStates {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  DEACTIVATED = 'DEACTIVATED',
  DELETED = 'DELETED',
  BANNED = 'BANNED',
  SUBSCRIBED = 'SUBSCRIBED',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  newsletter: boolean;
  avatar?: string;
  newsletterUuid: string;
  status: UserStates;
  role: UserRoles;
  lastLoggedIn?: Date;
  password?: string;
  telephoneNumber?: string | null;
  notes?: string;
  createdAt?: Date;
}
