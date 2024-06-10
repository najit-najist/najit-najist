import { DEFAULT_DATE_FORMAT } from '@constants';
import { UserWithRelations } from '@custom-types';
import { dayjs } from '@dayjs';
import { UserIcon } from '@heroicons/react/24/outline';
import { users as usersModel } from '@najit-najist/database/models';
import { Badge } from '@najit-najist/ui';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getFileUrl } from '@server/utils/getFileUrl';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const Users: FC<{ users: UserWithRelations[] }> = async ({ users }) => {
  const { id } = (await getCachedLoggedInUser()) ?? {};

  const mutatedUsers: Array<
    (typeof users)[number] & { staticAvatar?: string }
  > = users;

  for (const user of mutatedUsers) {
    if (user.avatar) {
      user.staticAvatar = getFileUrl(usersModel, user.id, user.avatar);
    }
  }

  return (
    <>
      {mutatedUsers.length ? (
        mutatedUsers.map((person) => (
          <tr key={person.email}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                  {person.staticAvatar ? (
                    <Image
                      className="h-10 w-10 rounded-full bg-gray-100"
                      width={40}
                      height={40}
                      src={person.staticAvatar}
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
              {person.status ? <Badge>{person.status}</Badge> : null}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {person.role}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {person.address?.municipality.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {person.createdAt
                ? dayjs.tz(person.createdAt).format(DEFAULT_DATE_FORMAT)
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
