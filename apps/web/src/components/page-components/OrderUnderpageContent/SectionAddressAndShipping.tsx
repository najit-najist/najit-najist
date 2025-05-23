import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { Order } from '@najit-najist/database/models';
import { FC } from 'react';

export const SectionAddressAndShipping: FC<{ order: Order }> = async ({
  order,
}) => {
  const [address, telephone] = await Promise.all([
    database.query.orderAddresses.findFirst({
      where: (s, { eq }) => eq(s.id, order.addressId),
    }),
    database.query.telephoneNumbers.findFirst({
      where: (s, { eq }) => eq(s.id, order.telephoneId),
    }),
  ]);

  const hasAlsoInvoiceAddress = !!order.invoiceAddressId;

  return (
    <dl className="text-sm">
      <dt className="font-semibold text-project-secondary">
        {hasAlsoInvoiceAddress
          ? 'Doručovací informace'
          : 'Doručovací a fakturační informace'}
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
      <dd className="mt-3 text-gray-700">
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
      {order.ico && !hasAlsoInvoiceAddress ? (
        <dd className="mt-3 text-gray-700">
          {order.ico ? (
            <div>
              <span className="text-sm">IČO </span>

              <span>{order.ico}</span>
            </div>
          ) : null}
          {order.dic ? (
            <div className="mt-1">
              <span>DIČ </span>
              <span>{order.dic}</span>
            </div>
          ) : null}
        </dd>
      ) : null}
      {/* <dt className="font-medium text-gray-900">Billing address</dt>
    <dd className="mt-2 text-gray-700">
      <address className="not-italic">
        <span className="block">Kristin Watson</span>
        <span className="block">7363 Cynthia Pass</span>
        <span className="block">Toronto, ON N3Y 4H8</span>
      </address>
    </dd> */}
    </dl>
  );
};
