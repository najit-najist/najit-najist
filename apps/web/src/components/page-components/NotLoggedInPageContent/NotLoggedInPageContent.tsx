import { FC } from 'react';
import { Links } from './Links';

export const NotLoggedInPageContent: FC = () => {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="">
        <h2 className="font-semibold text-deep-green-300 text-4xl text-center mb-10">
          Tato stránka je pouze pro přihlášené uživatele...
        </h2>
        <div className="flex gap-5 flex-wrap mx-auto justify-center">
          <Links />
        </div>
      </div>
    </div>
  );
};
