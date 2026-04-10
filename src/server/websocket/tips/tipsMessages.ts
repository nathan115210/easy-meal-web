// Payload shape shared by the live-tips websocket messages.
//
// `connected` is sent immediately after the websocket handshake succeeds.
// `tip` is sent on each loop iteration after fetching from /api/tips.
// `error` is sent when the websocket transport cannot fetch the next tip.

import type { LiveTipItem, LiveTipsSocketEvent } from '@/utils/types/liveTips';

export type TipsEvent = LiveTipsSocketEvent;

export function buildConnectedEvent(): TipsEvent {
  // A small connection acknowledgement helps the client distinguish between
  // "socket opened" and "first live payload arrived".
  return {
    type: 'connected',
    message: 'Connected to live tips.',
    sentAt: new Date().toISOString(),
  };
}

export function buildErrorEvent(message: string): TipsEvent {
  return {
    type: 'error',
    message,
    sentAt: new Date().toISOString(),
  };
}

export async function fetchTipEvent(appBaseUrl: string, tipIndex: number): Promise<TipsEvent> {
  // Reuse the app's own HTTP endpoint as the single source of truth for live
  // tips. The websocket layer only transports the result to connected clients.
  const response = await fetch(`${appBaseUrl}/api/tips?index=${tipIndex}`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Tips API request failed with status ${response.status}`);
  }

  // The API returns a simple JSON shape: { tip: LiveTipItem }.
  const payload = (await response.json()) as { tip?: LiveTipItem };

  if (
    typeof payload.tip !== 'object' ||
    payload.tip === null ||
    typeof payload.tip.id !== 'string' ||
    typeof payload.tip.label !== 'string' ||
    typeof payload.tip.icon !== 'string' ||
    payload.tip.icon.trim().length === 0 ||
    typeof payload.tip.sentAt !== 'string' ||
    Number.isNaN(Date.parse(payload.tip.sentAt))
  ) {
    throw new Error('Tips API returned an invalid tip payload');
  }

  // Normalize the HTTP response into the websocket event shape expected by the
  // client.
  return {
    type: 'tip',
    tip: payload.tip,
  };
}
