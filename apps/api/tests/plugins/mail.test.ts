import fs from 'fs-extra';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { bootstrap } from '../../src/bootstrap';

describe('plugins', () => {
  describe('mail', () => {
    it('should render relative', async () => {
      const name = 'John';
      const templateFileContent = `Hello ${name}`;
      const server = await bootstrap('testing');

      const res = await server.mail.render('test', {
        name,
      });

      expect(res).toBe(templateFileContent);
    });
  });
});
