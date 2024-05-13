import { PacketaGpsCoordinates } from './PacketaGpsCoordinates';
import { PacketaPhoto } from './PacketaPhoto';
import { PacketaPickupPointType } from './PacketaPickupPointType';
import { PacketaPointError } from './PacketaPointError';
import { PacketaPointHours } from './PacketaPointHours';
import { PacketaPointRecommendedState } from './PacketaPointRecommendedState';
import { PacketaPointWarning } from './PacketaPointWarning';

export type PacketaPoint = {
  /**
   * Only for internal pick-up points: Branch ID.
   * For external pick-up points: External carrier's pick-up point code.
   * For external pickup-up points use fields carrierId and carrierPickupPointId instead.
   */
  id: string;
  /**
   * Name that usually means city and street address. For large cities also includes city district.
   */
  name: string;
  /**
   * Name that usually means city and street address. For large cities also includes city district. OBSOLETE - Use field name instead.
   */
  nameStreet: string;
  /**
   * Country code. ISO 3166-1 alpha-2 code in lower case.
   */
  country: string[2];
  /**
   * ISO 4217 currency alphabetic code
   */
  currency: string[3];
  /**
   * Name of the business place
   */
  place: string;
  /**
   * Short additional information about the pick-up point place, e.g. "by the subway entrance"
   */
  special: string;
  /**
   * Street name and house number
   */
  street: string;
  /** City name */
  city: string;
  /** Postal code */
  zip: string;
  /**GPS coordinates */
  gps: PacketaGpsCoordinates;
  /**
   * Does the pick-up point allow consigning new parcels?
   */
  packetConsignment: boolean;
  /**
   * Does the pick-up point accept Return Parcels (paid by you / receiver)?
   */
  claimAssistant: boolean;
  /**
   * The maximum accepted weight of parcel in kilograms.
   */
  maxWeight: number;
  /** If not null, then it indicates that you must not allow this pick-up point to be selected by customer. However, you must display it and indicate its unavailability because this state is usually only temporary. */
  error: null | PacketaPointError;
  /** If not null, then it indicates that you must discourage the customer from selecting this pick-up point.  */
  warning: null | PacketaPointWarning;
  /** If not null, then it indicates you should promote this pick-up point over others */
  recommended: null | PacketaPointRecommendedState;
  /** Indicates if the pick-up point is new and if it is, you should promote it, so that customers take a notice of new pick-up points in their preferred areas. */
  isNew: boolean;
  /** Indicates (true/false) if the pick-up point allows C.O.D. payment via payment card. If you have disabled card payments for your Packeta client account, the return value will be always be null ("not available"), even if the pick-up point allows card payments for other clients. */
  creditCardPayment: null | boolean;
  /** Indicates if the pick-up point is open on Saturday, and if so, until which hour. If it's closed, the value is 0. Recommended as a filtering option. */
  saturdayOpenTo: number;
  /** Indicates if the pick-up point is open on Sunday, and if so, until which hour. If it's closed, the value is 0. Recommended as a filtering option. */
  sundayOpenTo: number;
  /** Indicates the latest hour until that the pick-up point is open on any single day of the week. E.g. if the opening hours are Mon-Thu 10:00-18:00, Fri 12:00-20:00, then the value would be 20. Recommended as a filtering option. */
  businessDaysOpenUpTo: number;
  /** Indicates if the pick-up point is open during lunch time (does not have a break during lunch time). Recommended as a filtering option. */
  businessDaysOpenLunchtime: boolean;
  /**  HTML	Information about the pick-up point whereabouts. Possible tags: &lt;p&gt;, &lt;b&gt;, &lt;a href target&gt;, &lt;i&gt;, &lt;em&gt;, &lt;strong&gt;, &lt;span&gt;, &lt;br&gt;. */
  directions: string;
  /**  HTML	Instructions for car access to the pick-up point, parking, etc. Possible tags: &lt;p&gt;, &lt;b&gt;, &lt;a href target&gt;, &lt;i&gt;, &lt;em&gt;, &lt;strong&gt;, &lt;span&gt;, &lt;br&gt;. This can be an empty string. */
  directionsCar: string;
  /** HTML	Instructions for public transport access to the pick-up point, bus stop name, etc. Possible tags: &lt;p&gt;, &lt;b&gt;, &lt;a href target&gt;, &lt;i&gt;, &lt;em&gt;, &lt;strong&gt;, &lt;span&gt;, &lt;br&gt;. This can be an empty string. */
  directionsPublic: string;
  /**
   * YYYY-MM-DD	If there is pick-up point vacation upcoming or in progress, this indicates when it starts. This will usually appear earlier than error=vacation.
   * @deprecated Use the field exceptionDays instead
   */
  holidayStart: null | string;
  /**
   * YYYY-MM-DD	If there is pick-up point vacation upcoming or in progress, this indicates when it ends. This will usually appear earlier than error=vacation.
   * @deprecated Use the field exceptionDays instead
   */
  holidayEnd: null | string;
  /** ExceptionDay	Contains holidays, exceptions or changes from opening hours. */
  exceptionDays: PacketaPoint[];
  /** Is the pick-up point accessible to people on wheelchairs? */
  wheelchairAccessible: boolean;
  /**
   * URL	Address of pick-up point detail web page.
   * @deprecated  Use field branchCode instead
   */
  url: string;
  /**
   * Only for internal pick-up points: Unique URL safe identifier to be used in an address of a pick-up point detail web page
   */
  branchCode: string;
  /**
   * Provides thumbnail and full-size photos of pick-up point.
   */
  photo: PacketaPhoto[];
  /**
   * Provides thumbnail and full-size photos of pick-up point
   * @deprecated Use field photo instead.
   */
  photos: PacketaPhoto[];
  /**
   * Provides HTML and structured information about pick-up point business hours.
   */
  openingHours: PacketaPointHours;
  /**
   * Values to be provided are either "internal" (internal pick-up points) or "external" (external pick-up points).
   */
  pickupPointType: PacketaPickupPointType;
  /**
   * Routing code of the branch. Used for custom labels.
   */
  routingCode: string;
  /**
   * Only for external pick-up points: External carrier ID
   */
  carrierId: string;
  /**
   * Only for external pick-up points: External carrier's pick-up point code
   */
  carrierPickupPointId: string;
  /**
   * Only for Packeta internal pick-up points: Group of pick-up point. Either zbox or empty for zpoint.
   */
  group: string;
  /**
   * Unique identifier
   */
  externalId: string;
};
