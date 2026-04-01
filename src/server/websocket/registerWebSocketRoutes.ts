import type { IncomingMessage, Server as HttpServer } from 'http';
import type { Duplex } from 'stream';
import { createTipsWebSocketServer } from './tips/createTipsWebSocketServer';

// Shared inputs that every websocket endpoint can depend on.
//
// `appBaseUrl` lets feature-specific websocket handlers call back into the app's
// own HTTP routes when they need data.
// `handleUpgrade` is Next's upgrade handler. We must forward unknown websocket
// upgrades to it so development features such as HMR keep functioning.
type RegisterWebSocketRoutesOptions = {
  appBaseUrl: string;
  handleUpgrade: (request: IncomingMessage, socket: Duplex, head: Buffer) => Promise<void>;
};

export function registerWebSocketRoutes(
  server: HttpServer,
  options: RegisterWebSocketRoutesOptions
): void {
  // Each websocket feature owns its own ws server instance. The route registry
  // decides which instance should receive a given upgrade request.
  const tipsWebSocketServer = createTipsWebSocketServer(options);

  console.log('[ws] websocket route registry ready');

  server.on('upgrade', (request, socket, head) => {
    const pathname = getRequestPathname(request);

    console.log('[ws] upgrade request received', {
      pathname,
      method: request.method,
      host: request.headers.host,
    });

    // Live tips channel.
    if (pathname === '/ws/live-tips') {
      console.log('[ws] routing upgrade to live tips websocket server', {
        pathname,
      });

      tipsWebSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
        console.log('[ws] websocket upgrade completed for live tips', {
          pathname,
        });

        tipsWebSocketServer.emit('connection', webSocket, request);
      });
      return;
    }

    // Any websocket route we do not own must be forwarded back to Next.
    // In development, this includes /_next/webpack-hmr for hot reload.
    console.log('[ws] forwarding upgrade back to Next', {
      pathname,
    });

    void options.handleUpgrade(request, socket, head);
  });
}

function getRequestPathname(request: IncomingMessage): string {
  // Upgrade requests only give us the raw request URL, so normalize it into a
  // full URL first and then read pathname safely.
  const host = request.headers.host ?? 'localhost';
  const url = request.url ?? '/';

  return new URL(url, `http://${host}`).pathname;
}
