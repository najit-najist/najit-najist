import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { Order } from '@najit-najist/database/models';
import { FC } from 'react';

export const SectionAddress: FC<{ order: Order }> = async ({ order }) => {
  const [address, telephone] = await Promise.all([
    database.query.orderAddresses.findFirst({
      where: (s, { eq }) => eq(s.orderId, order.id),
    }),
    database.query.telephoneNumbers.findFirst({
      where: (s, { eq }) => eq(s.id, order.telephoneId),
    }),
  ]);

  return (
    <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
      <div>
        <dt className="font-semibold text-project-secondary">
          Doručovací informace
        </dt>
        <dd className="mt-2 text-gray-700">
          <address className="not-italic">
            <span className="block">
              {order.firstName} {order.lastName}
            </span>
            <span className="block">
              {address?.streetName?.trim()}, {address?.houseNumber}
            </span>
            <span className="block">
              {address?.city} {address?.postalCode}
            </span>
          </address>
        </dd>
        <dd className="mt-4 text-gray-700">
          <div>
            <EnvelopeIcon className="w-3 h-3 inline-block mr-2 -mt-0.5" />{' '}
            <span className="hover:underline">
              <a href={`mailto:${order.email}`}>{order.email}</a>
            </span>
          </div>
          <div className="mt-1">
            <PhoneIcon className="w-3 h-3 inline-block mr-2 -mt-0.5" />{' '}
            <span>
              <a
                className="hover:underline"
                href={`+${telephone?.code}${telephone?.telephone.replaceAll(
                  ' ',
                  '',
                )}`}
              >
                +{telephone?.code} {telephone?.telephone}
              </a>
            </span>
          </div>
        </dd>
      </div>
      <div>
        {/* <dt className="font-medium text-gray-900">Billing address</dt>
    <dd className="mt-2 text-gray-700">
      <address className="not-italic">
        <span className="block">Kristin Watson</span>
        <span className="block">7363 Cynthia Pass</span>
        <span className="block">Toronto, ON N3Y 4H8</span>
      </address>
    </dd> */}
      </div>
    </dl>
  );
};
