import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NotificationBar from './NotificationBar';

describe('NotificationBar', () => {
  it('SHOULD render the notification message', () => {
    render(<NotificationBar message="Bar message" />);
    expect(screen.getByText('Bar message')).toBeInTheDocument();
  });

  it('SHOULD show the dismiss button by default (dismissible defaults to true)', () => {
    render(<NotificationBar message="Test" />);
    expect(screen.getByRole('button', { name: /dismiss notification/i })).toBeInTheDocument();
  });

  it('SHOULD hide the dismiss button when dismissible is false', () => {
    render(<NotificationBar message="Test" dismissible={false} />);
    expect(screen.queryByRole('button', { name: /dismiss notification/i })).not.toBeInTheDocument();
  });

  it('SHOULD show the dismiss button when dismissible is explicitly true', () => {
    render(<NotificationBar message="Test" dismissible={true} />);
    expect(screen.getByRole('button', { name: /dismiss notification/i })).toBeInTheDocument();
  });

  it('SHOULD remove the notification from the DOM after the dismiss button is clicked', async () => {
    render(<NotificationBar message="Test" />);
    await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(screen.queryByTestId('global-notification')).not.toBeInTheDocument();
  });

  it('SHOULD call the external onDismiss callback when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<NotificationBar message="Test" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not call the external onDismiss callback when dismissible is false', () => {
    const onDismiss = vi.fn();
    render(<NotificationBar message="Test" dismissible={false} onDismiss={onDismiss} />);
    // No dismiss button present, so onDismiss should never be called
    expect(screen.queryByRole('button', { name: /dismiss notification/i })).not.toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('SHOULD keep the notification visible before any interaction', () => {
    render(<NotificationBar message="Visible" />);
    expect(screen.getByTestId('global-notification')).toBeInTheDocument();
  });
});
