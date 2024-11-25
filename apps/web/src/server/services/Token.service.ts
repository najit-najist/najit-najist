import { jwtSecret } from '@constants';
import jwt, { Algorithm } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

export class TokenService {
  #algorithm: Algorithm = 'RS256';

  generate(payload: { id: string }) {
    return jwt.sign(payload, jwtSecret, {
      expiresIn: '1d',
      algorithm: this.#algorithm,
    });
  }

  decode<T extends { id: string }>(token: string) {
    return jwtDecode<T>(token.toString());
  }

  verify<T extends { id: string }>(token: string) {
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: [this.#algorithm],
    });

    return this.decode<T>(decoded.toString());
  }
}
