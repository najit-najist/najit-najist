import { DatabaseError } from 'pg';

export const isDatabaseDuplicateError = (databaseError: DatabaseError | any) =>
  databaseError instanceof DatabaseError && databaseError.code === '23505';
