import fs from 'fs-extra';
import * as url from 'url';
import path from 'path';
import crypto from 'node:crypto';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const numberOfBites = 10;
const root = path.resolve(__dirname, '..', 'dist');
const filename = 'version.json';
const filepath = path.join(root, filename);

if (!(await fs.pathExists(filepath))) {
  const version = crypto.randomBytes(numberOfBites).toString('hex');

  console.log(`Writing version file: ${version}`);

  await fs.writeJson(filepath, {
    version,
  });

  console.log(`Version file has been written`);
}
