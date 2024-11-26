import { PacketaValidationFailed } from './errors/PacketaValidationFailed';

export type PacketaValidatedVendor = {
  /**
   * Pickup point id.
   *
   * @var string
   */
  id: string;

  /**
   * Carrier id.
   */
  carrierId?: string | null;

  /**
   * Carrier pickup point id.
   */
  carrierPickupPointId?: string | null;
};

export type PacketaValidatedOptions = {
  /**
   * Comma separated list of allowed countries, specified with ISO 3166-1 alpha-2 code in lower case.
   */
  country?: string;
  // carriers	string	no	Comma separated list of allowed carriers, or string packeta for Packeta internal pick-up points.
  // claimAssistant	boolean	no	If present and set to true, selected pick-up point must provide Claim Assistant service.
  // packetConsignment	boolean	no	If present and set to true, selected pick-up point must provide new parcel consignment service.
  // weight	float	no	If present, selected pick-up must accept parcels of this weight in kilograms.
  // livePickupPoint	boolean	no	If present and set to true, selected pick-up point must provide age verification service.
  // expeditionDay	string:YYYY-MM-DD	no	Expected date of the parcel expedition. The selected pick-up point must not have a holiday of more than 3 days during this date.
  // vendors	Array: ValidatedVendor	no	List of vendor options.
  // cashOnDelivery	boolean	no	Whether cash on delivery is specified.
  // width	integer	no	Width of the parcel in centimeters. *
  // length	integer	no	Length of the parcel in centimeters. *
  // depth	integer	no	Depth of the parcel in centimeters. *
};

export type ValidatePointOptions = {
  point: PacketaValidatedVendor;
  options?: PacketaValidatedOptions;
  version?: {
    /**
     * @default v6
     */
    api?: string;
    /**
     * @default v1
     */
    widget?: string;
  };
};

const apiKey = process.env.NEXT_PUBLIC_PACKETA_KEY;

export const validatePoint = async ({
  point,
  options,
  version: { api: apiVersion = 'v6', widget: widgetVersion = 'v1' } = {},
}: ValidatePointOptions) => {
  if (!apiKey) {
    throw new Error('PACKETA_SECRET was not propertly provided');
  }

  const res = await fetch(
    `https://widget.packeta.com/${apiVersion}/pps/api/widget/${widgetVersion}/validate`,
    {
      method: 'POST',
      body: JSON.stringify({
        apiKey,
        point,
        options: {
          ...options,
          // TODO: this should change if we want to use packeta delivery
          carriers: 'packeta',
        },
      }),
      headers: {
        'X-Language': 'cs',
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok || res.status >= 400) {
    throw new PacketaValidationFailed(
      res.status === 400
        ? 'INVALID_INPUT'
        : res.status === 401
          ? 'INVALID_API_KEY'
          : 'FATAL',
      {
        status: res.status,
        statusText: res.statusText,
        text: res.status === 400 ? await res.json() : await res.text(),
      },
    );
  }

  return (await res.json()) as {
    isValid: true;
    point: {
      name: string;
      address: {
        street: string;
        city: string;
        zip: string;
        coutry: string;
      };
    } & ({ carrierId: string } | { group: 'zbox' });
  };
};
