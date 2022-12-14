import { bootstrap } from './bootstrap';
import { config } from './config';
import fs from 'fs-extra';
import url from 'node:url';
import path from 'node:path';

(async () => {
  const server = await bootstrap();

  if (!config.env.isDev) {
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const versionFilename = 'version.json';
    const versionFilepath = path.join(__dirname, versionFilename);

    if (await fs.pathExists(versionFilepath)) {
      const { version } = await fs.readJson(versionFilepath);
      config.app.version = version;
    }
  }

  server.listen(
    {
      port: config.server.port,
      host: process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
    },
    function (err, address) {
      if (err) {
        server.log.error(err);
        throw err;
      } else {
        server.log.info(
          `Server (version:${config.app.version}) up and running and listening on: ${address}`
        );
      }
    }
  );
})();
