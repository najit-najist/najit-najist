import { describe, expect, it } from 'vitest';
import { MailService } from '../../src/services/Mail.service';

describe('plugins', () => {
  describe('mail', () => {
    it('should render relative', async () => {
      const name = 'John';
      const templateFileContent = `Hello ${name}`;
      const mailService = new MailService();

      const res = await mailService.mailer.render('test', {
        name,
      });

      expect(res).toBe(templateFileContent);
    });
  });
});
