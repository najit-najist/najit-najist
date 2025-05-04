import fs from 'fs/promises';
import path from 'path';

const outputType = process.argv[2];
const outputFolder = process.argv[3];

if (outputType !== 'cjs' && outputType !== 'esm') {
  throw new Erorr('Only cjs and Esm is allowed');
}

await fs.writeFile(
  path.join(process.cwd(), outputFolder, 'package.json'),
  JSON.stringify({ type: outputType === 'cjs' ? 'commonjs' : outputType }),
  { encoding: 'utf8' },
);
