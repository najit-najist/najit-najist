export type ToCreateSchema<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
