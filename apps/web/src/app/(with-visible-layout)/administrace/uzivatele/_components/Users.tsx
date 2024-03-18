import { DEFAULT_DATE_FORMAT } from '@constants';
import { UserWithRelations } from '@custom-types';
import { UserIcon } from '@heroicons/react/24/outline';
import { getFileUrl } from '@najit-najist/api';
import { users as usersModel } from '@najit-najist/database/models';
import { getCachedLoggedInUser } from '@server-utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const Users: FC<{ users: UserWithRelations[] }> = async ({ users }) => {
  const { id } = (await getCachedLoggedInUser()) ?? {};

  return (
    <>
      {users.length ? (
        users.map((person) => (
          <tr key={person.email}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                  {person.avatar ? (
                    <Image
                      className="h-10 w-10 rounded-full bg-gray-100"
                      width={40}
                      height={40}
                      src={getFileUrl(usersModel, person.id, person.avatar)}
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex rounded-full">
                      <UserIcon className="w-5 text-gray-400 m-auto" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">
                    {id === person.id ? (
                      'Já'
                    ) : (
                      <>
                        {person.firstName} {person.lastName}
                      </>
                    )}
                  </div>
                  <div className="text-gray-500">{person.email}</div>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="text-gray-500">{person.telephone?.telephone}</div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                Active
              </span>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {person.role}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {person.address?.municipality.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {person.createdAt
                ? dayjs(person.createdAt).format(DEFAULT_DATE_FORMAT)
                : 'Neznámo kdy'}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <Link
                href={
                  id === person.id
                    ? `/muj-ucet/profil`
                    : `/administrace/uzivatele/${person.id}`
                }
                className="text-indigo-600 hover:text-indigo-900"
              >
                Upravit
                <span className="sr-only">
                  , {person.firstName} {person.lastName}
                </span>
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="text-center py-5">
            Žádní uživatelé pro aktuální vyhledávání...
          </td>
        </tr>
      )}
    </>
  );
};
