import { t } from '../instance';
import { isAuthed } from './internals/isAuthed';

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
