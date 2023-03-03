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
  username: string;
  email: string;
  newsletter: boolean;
  newsletterUuid: string;
  status: UserStates;
  role: UserRoles;
  lastLoggedIn?: Date;
  password?: string;
  telephoneNumber?: string | null;
  notes?: string;
  createdAt?: Date;
}
