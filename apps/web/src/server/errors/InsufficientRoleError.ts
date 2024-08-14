export class InsufficientRoleError extends Error {
  constructor() {
    super('Insufficient role for current logged in user');

    this.name = 'InsufficientRoleError';
  }
}
