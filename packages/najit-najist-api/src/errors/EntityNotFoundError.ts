export class EntityNotFoundError extends Error {
  public readonly entityName: string;

  constructor({ entityName }: { entityName: string }) {
    super(`Failed to find ${entityName}`);
    this.entityName = entityName;
  }
}
