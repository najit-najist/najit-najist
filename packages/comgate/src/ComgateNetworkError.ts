export class ComgateNetworkError extends Error {
  readonly meta: object;

  constructor(options: { path: string; response: Response }) {
    super('Failed to do request to comgate - request was not 200');

    this.meta = options;
  }
}
