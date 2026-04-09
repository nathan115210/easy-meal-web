import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mswServer } from '@/utils/test/unit-test/msw/mswServer';
import useLiveTips from './useLiveTips';
import type { LiveTipItem } from '@/utils/types/liveTips';

// ─── WebSocket mock ───────────────────────────────────────────────────────────

class MockWebSocket {
  static latest: MockWebSocket | null = null;

  url: string;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  close = vi.fn(() => {
    this.onclose?.({} as CloseEvent);
  });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.latest = this;
  }

  triggerOpen() {
    act(() => {
      this.onopen?.({} as Event);
    });
  }

  triggerMessage(data: unknown) {
    act(() => {
      this.onmessage?.({ data: JSON.stringify(data) } as MessageEvent);
    });
  }

  triggerError() {
    act(() => {
      this.onerror?.({} as Event);
    });
  }

  triggerClose() {
    act(() => {
      this.onclose?.({} as CloseEvent);
    });
  }
}

// ─── test setup ───────────────────────────────────────────────────────────────

const mockTip: LiveTipItem = {
  id: 'tip-1',
  icon: 'ChefHat',
  label: 'Mise en place saves time',
  sentAt: '2026-04-01T00:00:00Z',
};

type TipsApiMode = 'success' | 'empty' | 'error';

function setupTipsApiHandler(mode: TipsApiMode = 'success', tip: LiveTipItem = mockTip) {
  mswServer.use(
    http.get('/api/tips', () => {
      if (mode === 'error') return HttpResponse.json({}, { status: 500 });
      if (mode === 'empty') return HttpResponse.json({});
      return HttpResponse.json({ tip });
    })
  );
}

beforeEach(() => {
  MockWebSocket.latest = null;
  vi.stubGlobal('WebSocket', MockWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── tests ────────────────────────────────────────────────────────────────────

describe('useLiveTips', () => {
  it('SHOULD start with idle notificationState and idle connectionStatus', () => {
    setupTipsApiHandler();
    const { result } = renderHook(() => useLiveTips());
    expect(result.current.notificationState.kind).toBe('idle');
    expect(result.current.connectionStatus).toBe('idle');
  });

  it('SHOULD set connectionStatus to "connected" when the WebSocket opens', async () => {
    setupTipsApiHandler();
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => {
      expect(MockWebSocket.latest).not.toBeNull();
    });

    MockWebSocket.latest!.triggerOpen();

    await waitFor(() => {
      expect(result.current.connectionStatus).toBe('connected');
    });
  });

  it('SHOULD set notificationState to the tip returned by the /api/tips fetch', async () => {
    setupTipsApiHandler('success', mockTip);
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => {
      expect(result.current.notificationState.kind).toBe('tip');
    });

    if (result.current.notificationState.kind === 'tip') {
      expect(result.current.notificationState.tip.id).toBe('tip-1');
      expect(result.current.notificationState.tip.label).toBe('Mise en place saves time');
    }
  });

  it('SHOULD set notificationState to error when the /api/tips fetch fails', async () => {
    setupTipsApiHandler('error');
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => {
      expect(result.current.notificationState.kind).toBe('error');
    });

    if (result.current.notificationState.kind === 'error') {
      expect(result.current.notificationState.message).toBe('Unable to load live tips right now.');
    }
  });

  it('SHOULD update notificationState to "tip" when a tip WebSocket message is received', async () => {
    setupTipsApiHandler();
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => expect(MockWebSocket.latest).not.toBeNull());

    const incomingTip: LiveTipItem = {
      id: 'tip-ws-1',
      icon: 'Flame',
      label: 'High heat for a good sear',
      sentAt: '2026-04-01T01:00:00Z',
    };

    MockWebSocket.latest!.triggerMessage({ type: 'tip', tip: incomingTip });

    await waitFor(() => {
      expect(result.current.notificationState.kind).toBe('tip');
    });

    if (result.current.notificationState.kind === 'tip') {
      expect(result.current.notificationState.tip.id).toBe('tip-ws-1');
    }
  });

  it('SHOULD set notificationState to error when a WebSocket error event occurs and there is no current tip', async () => {
    // Use 'empty' so the initial fetch returns no tip and state stays idle,
    // allowing the socket error handler to set notificationState to error.
    setupTipsApiHandler('empty');
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => expect(MockWebSocket.latest).not.toBeNull());

    MockWebSocket.latest!.triggerError();

    await waitFor(() => {
      expect(result.current.connectionStatus).toBe('error');
    });

    await waitFor(() => {
      expect(result.current.notificationState.kind).toBe('error');
    });

    if (result.current.notificationState.kind === 'error') {
      expect(result.current.notificationState.message).toBe('Live tips connection failed.');
    }
  });

  it('SHOULD set connectionStatus to "closed" when the WebSocket closes without an error', async () => {
    setupTipsApiHandler();
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => expect(MockWebSocket.latest).not.toBeNull());

    MockWebSocket.latest!.triggerClose();

    await waitFor(() => {
      expect(result.current.connectionStatus).toBe('closed');
    });
  });

  it('SHOULD set notificationState to error when the WebSocket receives invalid JSON', async () => {
    setupTipsApiHandler();
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => expect(MockWebSocket.latest).not.toBeNull());

    act(() => {
      MockWebSocket.latest!.onmessage?.({ data: 'not valid json{{' } as MessageEvent);
    });

    await waitFor(() => {
      expect(result.current.notificationState.kind).toBe('error');
    });

    if (result.current.notificationState.kind === 'error') {
      expect(result.current.notificationState.message).toBe('Received an invalid live tip update.');
    }
  });

  it('SHOULD set connectionStatus to "closed" when disconnect is called', async () => {
    setupTipsApiHandler();
    const { result } = renderHook(() => useLiveTips());

    await waitFor(() => expect(MockWebSocket.latest).not.toBeNull());

    act(() => {
      result.current.disconnect();
    });

    await waitFor(() => {
      expect(result.current.connectionStatus).toBe('closed');
    });
  });
});
