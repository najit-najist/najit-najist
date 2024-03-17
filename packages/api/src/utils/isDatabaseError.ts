import { DatabaseError } from 'pg';

export const isDatabaseError = (error: any): error is DatabaseError =>
  'code' in error && error.name === 'DatabaseError';
