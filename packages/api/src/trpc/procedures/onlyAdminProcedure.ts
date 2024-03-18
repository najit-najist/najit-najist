import { t } from '../instance';
import { isAuthedAdmin } from './internals/isAuthedAdmin';

export const onlyAdminProcedure = t.procedure.use(isAuthedAdmin);
