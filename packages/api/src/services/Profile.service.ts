import { UserWithRelations } from './UserService';

export class ProfileService {
  private forUser: UserWithRelations;

  constructor(forUser: UserWithRelations) {
    this.forUser = forUser;
  }

  async resetPassword() {
    // TODO
  }

  async finalizePasswordReset(newPassword: string) {
    // TODO
    // TODO - should validate token expiry
  }

  static forUser(user: UserWithRelations) {
    return new ProfileService(user);
  }
}
