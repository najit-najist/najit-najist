import { describe, it, expect } from 'vitest';
import { formatErrorMessage } from '../../src/utils/formatErrorMessage';

describe('utils', () => {
  describe('formatErrorMessage', () => {
    it('should format first', () => {
      const payload = {
        name: 'Kanye',
        foo: 'bar',
      };

      const message = {
        before: 'Hello {name}, this is me - {robotName}',
        after: `Hello ${payload.name}, this is me - {robotName}`,
      };

      // @ts-ignore
      const res = formatErrorMessage(message.before, payload);

      expect(res).toBe(message.after);
    });
    it('should not throw on missing params', () => {
      const message = 'Test test {variable}';

      // @ts-ignore
      const res = formatErrorMessage(message);

      expect(res).toBe(message);
    });
  });
});
