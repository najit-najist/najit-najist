import soap from 'soap';

import { PacketaCurrentStatusRecord } from './PacketaCurrentStatusRecord';
import { PacketaPacketAttributes } from './PacketaPacketAttributes';
import { PacketaPacketPDFLabelFormat } from './PacketaPacketPDFLabelFormat';
import { PacketaStatusRecord } from './PacketaStatusRecord';

export type CreatePacketOptions = Pick<
  PacketaPacketAttributes,
  | 'number'
  | 'name'
  | 'surname'
  | 'email'
  | 'phone'
  | 'addressId'
  | 'value'
  | 'weight'
  | 'cod'
> &
  Partial<Pick<PacketaPacketAttributes, 'eshop'>>;

export type CancelPacketOptions = {};

const apiKey = process.env.PACKETA_SECRET;
const apiPublicKey = process.env.NEXT_PUBLIC_PACKETA_KEY;

export class PacketaSoapClient {
  private static PACKETERY_SOAP_URL =
    'http://www.zasilkovna.cz/api/soap-php-bugfix.wsdl';
  static async getClient() {
    if (!apiKey) {
      throw new Error('PACKETA_SECRET was not propertly provided');
    }

    return soap.createClientAsync(this.PACKETERY_SOAP_URL, {});
  }

  static async createPacket(options: CreatePacketOptions) {
    const client = await this.getClient();
    options.eshop = 'NajitNajist';
    options.weight ??= '0.00';
    const result = await client.createPacketAsync({
      apiPassword: apiKey,
      attributes: options,
    });

    return result[0]['createPacketResult'] as {
      barcode: string;
      barcodeText: string;
      id: string;
    };
  }

  static async cancelPacket(packetId: string | number) {
    const client = await this.getClient();
    await client.cancelPacketAsync({
      apiPassword: apiKey,
      packetId,
    });
  }

  static async getPacketStatus(packetId: string | number) {
    const client = await this.getClient();
    const result = await client.packetStatusAsync({
      apiPassword: apiKey,
      packetId,
    });

    return result[0]['packetStatusResult'] as PacketaCurrentStatusRecord;
  }

  // static async getPickupInfo({
  //   addressId,
  //   internal,
  // }: {
  //   addressId: string;
  //   internal: boolean;
  // }) {
  //   const url = new URL(
  //     `https://widget.packeta.com/v6/api/pps/api/widget/v2/I_${addressId}`,
  //   );
  //   if (!apiPublicKey) {
  //     throw new Error('NEXT_PUBLIC_PACKETA_KEY was not propertly provided');
  //   }

  //   url.searchParams.set('App_ApiKey', apiPublicKey!);

  //   const response = await fetch(url);
  //   const result = response.json();
  // }

  static async getTracking(packetId: string | number) {
    const client = await this.getClient();
    const result = await client.packetTrackingAsync({
      apiPassword: apiKey,
      packetId,
    });

    const { record } = result[0]['packetTrackingResult'] as {
      record: PacketaStatusRecord | PacketaStatusRecord[];
    };

    return Array.isArray(record) ? record : [record];
  }

  static async getPacketLabelPdfBinary(
    packetId: string | number,
    format: PacketaPacketPDFLabelFormat = PacketaPacketPDFLabelFormat.A6,
  ) {
    const client = await this.getClient();
    const result = await client.packetLabelPdfAsync({
      apiPassword: apiKey,
      packetId,
      format,
      offset: 0,
    });

    const trackingResult = result[0]['packetLabelPdfResult'];

    return trackingResult;
  }
}
