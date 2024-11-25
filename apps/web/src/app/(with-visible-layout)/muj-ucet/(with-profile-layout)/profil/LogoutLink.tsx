'use client';

export const LogoutLink = () => (
  <a
    href="/logout"
    className="text-red-500 hover:underline font-medium text-lg"
    onClick={(event) => {
      if (!confirm('Opravdu odhlásit?')) {
        event.preventDefault();
      }
    }}
  >
    Odhlásit se
  </a>
);
