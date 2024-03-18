import bcrypt from 'bcrypt';

import { config } from '../config';

export class PasswordService {
  static hash(value: string) {
    return bcrypt.hash(value, config.server.secrets.saltRounds);
  }

  static hashSync(value: string) {
    return bcrypt.hashSync(value, config.server.secrets.saltRounds);
  }

  static validate(hashed: string, newPassword: string | Buffer) {
    return bcrypt.compare(newPassword, hashed);
  }

  static validateSync(hashed: string, newPassword: string | Buffer) {
    return bcrypt.compareSync(newPassword, hashed);
  }
}
