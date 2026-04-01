import { createServer, type Server } from 'http';
import next from 'next';
import { registerWebSocketRoutes } from '../websocket/registerWebSocketRoutes';

export async function startServer(): Promise<Server> {
  // Next still renders every HTTP request for the app.
  // This custom Node server exists so we can also listen for raw websocket
  // upgrade requests on the same port.
  const dev = process.env.NODE_ENV !== 'production';
  const hostname = process.env.HOSTNAME ?? 'localhost';
  const port = Number(process.env.PORT ?? 3000);

  // The websocket layer fetches live tip data from our own HTTP route.
  // Keeping this base URL configurable makes local development and future
  // deployment wiring easier.
  const appBaseUrl = process.env.INTERNAL_BASE_URL ?? `http://localhost:${port}`;

  const app = next({ dev, hostname, port });

  // Next must finish preparing before we ask it for request or upgrade
  // handlers. Calling getUpgradeHandler before prepare throws at runtime.
  await app.prepare();

  const handle = app.getRequestHandler();
  const handleUpgrade = app.getUpgradeHandler();

  // Normal HTTP traffic still goes through Next.
  const server = createServer((req, res) => {
    void handle(req, res);
  });

  // Our websocket registry handles only app-specific websocket routes and
  // delegates all other upgrades back to Next. That delegation is required in
  // development so Next's own HMR socket keeps working.
  registerWebSocketRoutes(server, {
    appBaseUrl,
    handleUpgrade,
  });

  // Wait until the Node server is actually listening before resolving.
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => {
      server.off('listening', onListening);
      reject(error);
    };

    const onListening = () => {
      server.off('error', onError);
      resolve();
    };

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, hostname);
  });

  console.log(`Server listening on http://${hostname}:${port}`);

  return server;
}
