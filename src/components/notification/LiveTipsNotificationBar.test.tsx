import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type MockedFunction, describe, expect, it, vi } from 'vitest';
import useLiveTips from '@/utils/hooks/useLiveTips';
import type {
  LiveTipsConnectionStatus,
  LiveTipsNotificationState,
} from '@/utils/hooks/useLiveTips';
import LiveTipsNotificationBar from './LiveTipsNotificationBar';

/** Hoist the module mock */
vi.mock('@/utils/hooks/useLiveTips', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const useLiveTipsMock = useLiveTips as unknown as MockedFunction<typeof useLiveTips>;

function mockUseLiveTips(
  notificationState: LiveTipsNotificationState,
  connectionStatus: LiveTipsConnectionStatus,
  disconnect = vi.fn()
) {
  useLiveTipsMock.mockReturnValue({ notificationState, connectionStatus, disconnect });
}

describe('LiveTipsNotificationBar', () => {
  it('SHOULD return null when connectionStatus is "error"', () => {
    mockUseLiveTips({ kind: 'idle' }, 'error');
    const { container } = render(<LiveTipsNotificationBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('SHOULD return null when connectionStatus is "closed"', () => {
    mockUseLiveTips({ kind: 'idle' }, 'closed');
    const { container } = render(<LiveTipsNotificationBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('SHOULD return null when notificationState.kind is "idle"', () => {
    mockUseLiveTips({ kind: 'idle' }, 'connected');
    const { container } = render(<LiveTipsNotificationBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('SHOULD return null when notificationState.kind is "error"', () => {
    mockUseLiveTips({ kind: 'error', message: 'Something went wrong' }, 'connected');
    const { container } = render(<LiveTipsNotificationBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('SHOULD render the tip label when notificationState.kind is "tip" and connectionStatus is "connected"', () => {
    mockUseLiveTips(
      {
        kind: 'tip',
        tip: {
          id: 'tip-1',
          icon: 'ChefHat',
          label: 'Mise en place saves time',
          sentAt: '2026-04-01T00:00:00Z',
        },
      },
      'connected'
    );
    render(<LiveTipsNotificationBar />);
    expect(screen.getByText('Mise en place saves time')).toBeInTheDocument();
  });

  it('SHOULD render the notification inside the global-notification container', () => {
    mockUseLiveTips(
      {
        kind: 'tip',
        tip: {
          id: 'tip-2',
          icon: 'Flame',
          label: 'High heat for a good sear',
          sentAt: '2026-04-01T01:00:00Z',
        },
      },
      'connected'
    );
    render(<LiveTipsNotificationBar />);
    expect(screen.getByTestId('global-notification')).toBeInTheDocument();
  });

  it('SHOULD call disconnect when the dismiss button is clicked', async () => {
    const disconnect = vi.fn();
    mockUseLiveTips(
      {
        kind: 'tip',
        tip: {
          id: 'tip-3',
          icon: 'Timer',
          label: 'Rest your meat after cooking',
          sentAt: '2026-04-01T02:00:00Z',
        },
      },
      'connected',
      disconnect
    );
    render(<LiveTipsNotificationBar />);
    await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
