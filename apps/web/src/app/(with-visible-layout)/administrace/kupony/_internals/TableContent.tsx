import { Badge } from '@components/common/Badge';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Tooltip } from '@components/common/Tooltip';
import { dayjs } from '@dayjs';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { database } from '@najit-najist/database';
import { formatPrice } from '@utils';
import { isCouponExpired } from '@utils/isCouponExpired';
import Link from 'next/link';

const DATE_FORMAT = 'DD.MM. YYYY v HH:mm';

export async function TableContent() {
  const items = await database.query.coupons.findMany({
    with: {
      patches: {
        orderBy: (schema, { desc }) => desc(schema.createdAt),
        limit: 1,
      },
    },
  });

  return (
    <>
      <tbody className="divide-y divide-gray-200">
        <>
          {items.length ? (
            items.map((item) => {
              const patch = item.patches[0];
              const reductions: string[] = [];
              const validity: string[] = [];

              if (patch?.reductionPercentage) {
                reductions.push(`${patch?.reductionPercentage}%`);
              }
              if (patch?.reductionPrice) {
                reductions.push(formatPrice(patch.reductionPrice));
              }

              if (item.validFrom) {
                validity.push(
                  `Od ${dayjs.tz(item.validFrom).format(DATE_FORMAT)}`,
                );
              }
              if (item.validTo) {
                validity.push(
                  `Do ${dayjs.tz(item.validTo).format(DATE_FORMAT)}`,
                );
              }

              const isExpired = isCouponExpired(item);

              return (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {isExpired ? (
                      <Tooltip
                        trigger={
                          <ExclamationTriangleIcon className="w-5 h-5 inline text-orange-500 mr-2" />
                        }
                      >
                        Expirováno
                      </Tooltip>
                    ) : null}
                    <Badge color={item.enabled ? 'green' : 'red'}>
                      {item.enabled ? 'Aktivováno' : 'Neaktivováno'}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                    <Badge color="blue">{item.name}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {reductions.length ? reductions.join(' + ') : null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {validity.length ? validity.join(' ') : 'Validní navždy'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="text-gray-500">
                      {dayjs.tz(item.createdAt).format(DATE_FORMAT)}
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link
                      href={`/administrace/kupony/${item.id}`}
                      className={buttonStyles({
                        size: 'sm',
                        appearance: 'link',
                      })}
                    >
                      Upravit
                      <span className="sr-only">, {item.name}</span>
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-5">
                Zatím žádné kupóny...
              </td>
            </tr>
          )}
        </>
      </tbody>
      {/* <tfoot className=" w-full">
                <tr>
                  <th colSpan={6} className="">
                    <Pagination
                      currentPage={page}
                      totalItems={totalItems}
                      totalPages={totalPages}
                    />
                  </th>
                </tr>
              </tfoot> */}
    </>
  );
}
