import { bootstrap } from './bootstrap';
import { config } from './config';

(async () => {
  const server = await bootstrap();

  console.log(import.meta);

  server.listen(
    {
      port: config.server.port,
      host: import.meta.env.DEV ? 'localhost' : '0.0.0.0',
    },
    function (err, address) {
      if (err) {
        server.log.error(err);
        throw err;
      } else {
        server.log.info(`Server up and running and listening on: ${address}`);
      }
    }
  );
})();
