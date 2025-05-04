import { Badge } from '@components/common/Badge';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { database } from '@najit-najist/database';
import { formatPrice } from '@utils';
import Link from 'next/link';

export async function TableContent() {
  const items = await database.query.orderDeliveryMethods.findMany({
    where: (schema, { not, eq }) => not(eq(schema.disabled, true)),
    orderBy: (schema, { desc }) => desc(schema.createdAt),
  });

  return (
    <>
      <tbody className="divide-y divide-gray-200">
        <>
          {items.length ? (
            items.map((item) => {
              return (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                    <Badge color="blue">{item.name}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.notes}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatPrice(item.price ?? 0)}
                  </td>

                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link
                      href={`/administrace/doprava/${item.id}`}
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
                Zatím žádné možnosti dopravy...
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
