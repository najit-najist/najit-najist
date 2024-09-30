export type PacketPointInfo = {
  externalId: string;
  special?: string;
  name: string;
  branchCode: string;
  exchangePointId: string;
  address?: {
    name: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  currency: 'CZK';
  // directions: {
  //   walk:string,
  //   car: '\u003Cp\u003EParkov\u00E1n\u00ED mo\u017En\u00E9 p\u0159ed obchodem, pouze modr\u00E1 z\u00F3na.\u003C/p\u003E',
  //   publicTransport:
  //     '\u003Cp\u003EZast\u00E1vka autobusu - Tachovsk\u00E9 n\u00E1m\u011Bst\u00ED, 260m\u003C/p\u003E',
  // },
  url: string;
  photos: Array<{
    thumbnail: string;
    normal: string;
  }>;
  openingHours: {
    regular: {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
    };
    saturdayOpensTo: number;
    sundayOpensTo: number;
    // exceptionDays: [{ from: '2024-10-28T00:00:00', times: [] }],
    businessDaysLunchtime: false;
    businessDaysOpensUpTo: 0;
  };
  state: {};
  flags: {
    isNew: false;
    isOpened: true;
    isClaimAssistant: true;
    isCreditCardPayment: true;
    isCashOnDelivery: true;
    isPacketConsignment: true;
    openingHours_BusinessDaysLunchTime: false;
    openingHours_SaturdayOpen: false;
    openingHours_SundayOpen: false;
    isWheelChairAccessible: false;
    isDepot: false;
    isBox: false;
    isRecommended: true;
    isAlmostFull: false;
    isFull: false;
    isOnHoliday: false;
    isClosing: false;
    isToBeClosed: false;
    hasKeypad: false;
  };
  pickupPointType: 'internal';
  routingCode: 'C10-212-31240';
  routingName: 'Praha 3, \u017Di\u017Ekov, Mil\u00ED\u010Dova 462/21';
  recommendedPostTime: '09:30';
  canBeSelected: true;
};
