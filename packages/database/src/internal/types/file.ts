import { customType } from 'drizzle-orm/pg-core';

export const fileFieldType = customType<{ data: string }>({
  dataType() {
    return 'text';
  },
});
