import { PacketaAttribute } from './PacketaAttribute';
import { PacketaCurrency } from './PacketaCurrency';
import { PacketaPacketSize } from './PacketaPacketSize';
import { PacketaSecurity } from './PacketaSecurity';

export type PacketaPacketAttributes = {
  /**
   * If you have assigned offline barcode range, fill the unique packetID here. Otherwise ignore this attribute. NOTE: Make sure to use 64-bit type
   * 10 digits
   */
  id?: number;
  /**
   * ID of the third-party sender or member of Packeta affiliate program.
   * 16 alphanumeric
   */
  affiliateId?: string;
  /**
   * A unique ID of the order (from your e-shop).
   * 1-36 alphanumeric
   */
  number: string;
  /**
   * 	Recipient's name.
   * 1-32 alphanumeric
   */
  name: string;
  /**
   * Recipient's surname.
   *
   * 1-32 alphanumeric
   */
  surname: string;
  /**
   * Branch ID or an ID of the external carrier.
   */
  addressId: string;
  /**
   * if no phone	Recipient's e-mail.
   * valid e-mail
   */
  email: string;
  /**
   * Recipient's phone.
   *
   * examples are in phone number formats
   */
  phone: string;
  /**
   * Currency of COD and packet value.
   */
  currency?: PacketaCurrency;
  /**
   * COD amount. Integer for CZK
   */
  cod?: number;
  /**
   * Packet's value (for insurance purposes).
   * see max. values in TOS (5000kč)
   */
  value: number;
  /**
   * If the entered sender does not exist yet, a new one is created.
   */
  eshop: string;
  /**
   * Weight in kg
   */
  weight?: number | string;
  /**
   * Date for scheduled delivery in future. Package can be delivered on this date or later. The format is YYYY-MM-DD.
   * within next 14 days
   */
  deliverOn?: Date;
  /**
   * Recipient's company.
   */
  company?: string;
  /**
   * If set to 1, the packet will be handed over only to person older than 18 years. An identification will be required. Functionality is accessible just for Packeta internal pickup points in CZ/SK/HU/RO, it is not accessible for couriers and external pickup points.
   */
  adultContent?: boolean;
  /**
   * Sender's note. It will be displayed on the label, if supported by courier. It will be shortened up to 32 characters, if limited by courier.
   * 1-128 alphanumeric
   */
  note?: string;
  /**
   * Carrier services separated by comma. More information here.
   */
  carrierService?: string;
  /**
   * A custom barcode. Only applicable if you have an agreement about using custom barcodes.
   */
  customerBarcode?: string;
  /**
   * Code of a carrier's pick up point. Required only if the chosen carrier offers them.
   */
  carrierPickupPoint?: string;
  /**
   * 	Some carriers require the dimensions of the packet.
   */
  size?: PacketaPacketSize;
  /**
   * Additional information which are specific for some carriers or other cases.
   */
  attributes?: PacketaAttribute[];
  /**
   * Additional information about content of packet (for example for customs proceedings).
   */
  items?: PacketaAttribute[];
  /**
   * Defines additional security options.
   */
  security?: PacketaSecurity;
  // TBD - https://docs.packetery.com/03-creating-packets/06-packetery-api-reference.html#toc-services
  /**
   * Optional services. This attribute has not yet been implemented. This is reserved record for future use.
   */
  // services?: Services,
} & (
  | {
      /**
       * Street.
       * 	1-32
       */
      street: string;
      /**
       * House number.
       * 1-16
       */
      houseNumber: string;
      /**
       * 	City.
       * 1-32
       */
      city: string;
      /**
       * Province.
       * 1-32
       */
      province: string;
      /**
       * delivery	ZIP code
       */
      zip: string;
    }
  | {}
);
