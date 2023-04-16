import Link from 'next/link';
import { FC } from 'react';

export const BottomLinks: FC = () => {
  return (
    <div className="flex items-center justify-center mt-5 gap-5">
      <Link
        href="/"
        className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
      >
        Domů
      </Link>

      <Link
        href="/login"
        className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
      >
        Přihlášení
      </Link>

      <Link
        href="/registrace"
        className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
      >
        Registrace
      </Link>

      <Link
        href="/kontakt"
        className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
      >
        Kontakt
      </Link>
    </div>
  );
};
