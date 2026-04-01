import { WebSocket, WebSocketServer } from 'ws';
import {
  buildConnectedEvent,
  buildErrorEvent,
  fetchTipEvent,
  type TipsEvent,
} from './tipsMessages';

const TIP_BROADCAST_INTERVAL_MS = 6000; // 6 seconds

// Configuration for the live-tips websocket feature.
//
// Right now the only dependency is the app base URL so the websocket transport
// can fetch fresh tip content from /api/tips instead of duplicating data.
type CreateTipsWebSocketServerOptions = {
  appBaseUrl: string;
};

export function createTipsWebSocketServer(
  options: CreateTipsWebSocketServerOptions
): WebSocketServer {
  // `noServer: true` means this ws server does not listen on its own port.
  // Instead, our central upgrade router decides when an incoming upgrade request
  // belongs to this feature and hands the socket to this instance.
  const webSocketServer = new WebSocketServer({ noServer: true });

  console.log('[ws/live-tips] websocket server created', {
    appBaseUrl: options.appBaseUrl,
  });

  webSocketServer.on('connection', (webSocket, request) => {
    const clientLabel = getClientLabel(request);

    console.log('[ws/live-tips] client connected', {
      client: clientLabel,
      readyState: getReadyStateLabel(webSocket.readyState),
    });

    // Send an immediate acknowledgement so the client knows the websocket is
    // open before the first 5-second broadcast happens.
    const connectedEvent = buildConnectedEvent();

    console.log('[ws/live-tips] sending connected event', {
      client: clientLabel,
      payload: connectedEvent,
    });

    sendJson(webSocket, connectedEvent);

    // This timer drives the recurring push loop. We use a self-rescheduling
    // timeout instead of setInterval because each tick performs async work.
    // That avoids overlapping fetches if one tick takes longer than expected.
    let nextBroadcastTimerId: ReturnType<typeof setTimeout> | undefined;

    // Once the connection closes, every future tick should stop immediately and
    // no new timers should be scheduled.
    let connectionClosed = false;

    // Tracks which tip to show next so each broadcast advances through the
    // full tip list in order, cycling back to the start after the last tip.
    let tipIndex = 0;

    const pushTipAndScheduleNextRun = async () => {
      console.log('[ws/live-tips] broadcast loop tick started', {
        client: clientLabel,
        connectionClosed,
        readyState: getReadyStateLabel(webSocket.readyState),
      });

      // Guard against races where the timer fires after the socket has already
      // started closing.
      if (connectionClosed || webSocket.readyState !== WebSocket.OPEN) {
        console.log('[ws/live-tips] skipping tick because socket is not open', {
          client: clientLabel,
          connectionClosed,
          readyState: getReadyStateLabel(webSocket.readyState),
        });

        return;
      }

      try {
        // Tip content comes from the HTTP API so there is only one source of
        // truth for tip selection and payload shape.
        console.log('[ws/live-tips] fetching next tip event', {
          client: clientLabel,
          endpoint: `${options.appBaseUrl}/api/tips`,
          tipIndex,
        });

        const tipEvent = await fetchTipEvent(options.appBaseUrl, tipIndex);
        tipIndex += 1;

        console.log('[ws/live-tips] tip event fetched successfully', {
          client: clientLabel,
          payload: tipEvent,
        });

        if (webSocket.readyState === WebSocket.OPEN) {
          console.log('[ws/live-tips] sending tip event', {
            client: clientLabel,
            payload: tipEvent,
          });

          sendJson(webSocket, tipEvent);
        }
      } catch (error) {
        // If the API is temporarily unavailable, keep the socket alive and emit
        // a fallback message instead of closing the client connection.
        if (webSocket.readyState === WebSocket.OPEN) {
          const fallbackEvent = buildErrorEvent('Unable to load a tip right now.');

          console.error('[ws/live-tips] failed to fetch tip event, sending fallback', {
            client: clientLabel,
            error,
            payload: fallbackEvent,
          });

          sendJson(webSocket, fallbackEvent);
        }
      }

      // Reschedule the next broadcast only after the current async work has
      // completed. This is the actual loop.
      if (!connectionClosed) {
        console.log('[ws/live-tips] scheduling next broadcast', {
          client: clientLabel,
          delayMs: TIP_BROADCAST_INTERVAL_MS,
        });

        nextBroadcastTimerId = setTimeout(() => {
          void pushTipAndScheduleNextRun();
        }, TIP_BROADCAST_INTERVAL_MS);
      }
    };

    // Kick off the recurring loop for this specific client connection.
    console.log('[ws/live-tips] scheduling first broadcast', {
      client: clientLabel,
      delayMs: TIP_BROADCAST_INTERVAL_MS,
    });

    nextBroadcastTimerId = setTimeout(() => {
      void pushTipAndScheduleNextRun();
    }, TIP_BROADCAST_INTERVAL_MS);

    webSocket.on('close', (code, reason) => {
      connectionClosed = true;

      console.log('[ws/live-tips] client connection closed', {
        client: clientLabel,
        code,
        reason: reason.toString(),
        readyState: getReadyStateLabel(webSocket.readyState),
      });

      // Stop any pending future broadcast once the client disconnects.
      if (nextBroadcastTimerId) {
        console.log('[ws/live-tips] clearing scheduled broadcast after close', {
          client: clientLabel,
        });

        clearTimeout(nextBroadcastTimerId);
      }
    });

    webSocket.on('error', (error) => {
      connectionClosed = true;

      console.error('[ws/live-tips] websocket error', {
        client: clientLabel,
        error,
        readyState: getReadyStateLabel(webSocket.readyState),
      });

      // Treat socket errors the same way as close: stop scheduling work for a
      // connection that is no longer healthy.
      if (nextBroadcastTimerId) {
        console.log('[ws/live-tips] clearing scheduled broadcast after error', {
          client: clientLabel,
        });

        clearTimeout(nextBroadcastTimerId);
      }
    });
  });

  return webSocketServer;
}

function sendJson(webSocket: WebSocket, payload: TipsEvent): void {
  // Keep serialization in one place so feature handlers can work with plain
  // objects and leave transport formatting to this helper.
  webSocket.send(JSON.stringify(payload));
}

function getClientLabel(request: import('http').IncomingMessage): string {
  const forwardedForHeader = request.headers['x-forwarded-for'];
  const forwardedFor = Array.isArray(forwardedForHeader)
    ? forwardedForHeader[0]
    : forwardedForHeader;
  const remoteAddress = request.socket.remoteAddress ?? 'unknown-address';
  const remotePort = request.socket.remotePort ?? 'unknown-port';

  return `${forwardedFor ?? remoteAddress}:${remotePort}`;
}

function getReadyStateLabel(readyState: number): string {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return `UNKNOWN(${readyState})`;
  }
}
