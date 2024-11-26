export class PacketaValidationFailed extends Error {
  readonly response: object;
  readonly area: string;

  constructor(
    area: 'FATAL' | 'INVALID_INPUT' | 'INVALID_API_KEY',
    response: object,
  ) {
    super('Packeta validation failed');
    this.name = 'PacketaValidationFailed';

    this.response = response;
    this.area = area;
  }
}
