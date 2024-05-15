export class UserNotAuthorizedError extends Error {
  constructor() {
    super('User not logged in');
    this.name = 'UserNotAuthorizedError';
  }
}
