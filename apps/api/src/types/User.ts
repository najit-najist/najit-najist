export enum UserRoles {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL',
  PREMIUM = 'PREMIUM',
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
  email: string;
  newsletter: boolean;
  createdAt?: Date;
  status: UserStates;
  password?: string;
  telephoneNumber?: string;
  newsletterUuid: string;
  lastLoggedIn?: Date;
  notes?: string;
  username?: string;
  role: UserRoles;
}
