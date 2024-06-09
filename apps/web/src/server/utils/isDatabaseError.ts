import { DatabaseError } from 'pg';

export const isDatabaseError = (error: any): error is DatabaseError =>
  error instanceof DatabaseError;
