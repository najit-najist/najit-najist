import { describe, expect, it } from 'vitest';
import { MailService } from '../../src/services/Mail.service';

describe('plugins', () => {
  describe('mail', () => {
    it('should render relative', async () => {
      const name = 'John';
      const templateFileContent = `Hello ${name}`;

      const res = await MailService.mailer.render('test', {
        name,
      });

      expect(res).toBe(templateFileContent);
    });
  });
});
