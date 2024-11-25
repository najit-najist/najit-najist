import bcrypt from 'bcrypt';

const SALT_ROUNDS_COUNT = 10;

export class PasswordService {
  static hash(value: string) {
    return bcrypt.hash(value, SALT_ROUNDS_COUNT);
  }

  static hashSync(value: string) {
    return bcrypt.hashSync(value, SALT_ROUNDS_COUNT);
  }

  static validate(hashed: string, newPassword: string | Buffer) {
    return bcrypt.compare(newPassword, hashed);
  }

  static validateSync(hashed: string, newPassword: string | Buffer) {
    return bcrypt.compareSync(newPassword, hashed);
  }
}
