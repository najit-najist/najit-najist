import { bootstrap } from './bootstrap';
import { config } from './config';

(async () => {
  const server = await bootstrap();

  // Take care of server in vite-node dev mode
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      server.close();
    });

    import.meta.hot.dispose(() => {
      server.close();
    });
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
        server.log.info(`Server up and running and listening on: ${address}`);
      }
    }
  );
})();
