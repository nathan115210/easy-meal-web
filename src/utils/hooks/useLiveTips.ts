'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LiveTipItem, LiveTipsSocketEvent } from '@/utils/types/liveTips';

export type LiveTipsConnectionStatus = 'idle' | 'connected' | 'error' | 'closed';

export type LiveTipsNotificationState =
  | {
      kind: 'idle';
    }
  | {
      kind: 'tip';
      tip: LiveTipItem;
    }
  | {
      kind: 'error';
      message: string;
    };

function useLiveTips() {
  const [notificationState, setNotificationState] = useState<LiveTipsNotificationState>({
    kind: 'idle',
  });
  const [connectionStatus, setConnectionStatus] = useState<LiveTipsConnectionStatus>('idle');
  const socketRef = useRef<WebSocket | null>(null);
  const hasConnectionErrorRef = useRef<boolean>(false);

  const disconnect = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
    setConnectionStatus('closed');
  }, []);

  useEffect(() => {
    let didCancel = false;

    const applySocketEvent = (event: LiveTipsSocketEvent) => {
      if (event.type === 'tip') {
        setNotificationState((currentState) => {
          if (
            currentState.kind === 'tip' &&
            currentState.tip.id === event.tip.id &&
            currentState.tip.sentAt === event.tip.sentAt
          ) {
            return currentState;
          }

          return {
            kind: 'tip',
            tip: event.tip,
          };
        });

        return;
      }

      if (event.type === 'error') {
        setNotificationState((currentState) => {
          if (currentState.kind === 'error' && currentState.message === event.message) {
            return currentState;
          }

          return {
            kind: 'error',
            message: event.message,
          };
        });

        return;
      }
    };

    const loadInitialTip = async () => {
      try {
        const response = await fetch('/api/tips', {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Tips API request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as { tip?: LiveTipItem };

        if (
          didCancel ||
          typeof payload.tip !== 'object' ||
          payload.tip === null ||
          typeof payload.tip.id !== 'string' ||
          typeof payload.tip.label !== 'string' ||
          typeof payload.tip.sentAt !== 'string'
        ) {
          return;
        }

        setNotificationState({
          kind: 'tip',
          tip: payload.tip,
        });
      } catch {
        if (!didCancel) {
          setNotificationState({
            kind: 'error',
            message: 'Unable to load live tips right now.',
          });
        }
      }
    };

    void loadInitialTip();

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws/live-tips`);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus('connected');
    };

    socket.onmessage = (event) => {
      try {
        applySocketEvent(JSON.parse(event.data) as LiveTipsSocketEvent);
      } catch {
        setNotificationState({
          kind: 'error',
          message: 'Received an invalid live tip update.',
        });
      }
    };

    socket.onerror = () => {
      hasConnectionErrorRef.current = true;
      setConnectionStatus('error');

      setNotificationState((currentState) => {
        if (currentState.kind === 'tip') {
          return currentState;
        }

        return {
          kind: 'error',
          message: 'Live tips connection failed.',
        };
      });
    };

    socket.onclose = () => {
      if (!hasConnectionErrorRef.current) {
        setConnectionStatus('closed');
      }
    };

    return () => {
      didCancel = true;
      hasConnectionErrorRef.current = false;
      socket.close();
      socketRef.current = null;
    };
  }, []);

  return {
    notificationState,
    connectionStatus,
    disconnect,
  };
}

export default useLiveTips;
