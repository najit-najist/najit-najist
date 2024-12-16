'use client';

import { buttonStyles } from '@components/common/Button/buttonStyles';

export const LogoutLink = () => (
  <a
    href="/logout"
    className={buttonStyles({ color: 'red', appearance: 'ghost' })}
    onClick={(event) => {
      if (!confirm('Opravdu odhlásit?')) {
        event.preventDefault();
      }
    }}
  >
    Odhlásit se
  </a>
);
