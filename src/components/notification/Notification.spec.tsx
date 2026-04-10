import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Notification, { type NotificationType } from './Notification';

describe('Notification', () => {
  it('SHOULD render the message text', () => {
    render(<Notification message="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('SHOULD render with data-testid global-notification on the root element', () => {
    render(<Notification message="Test" />);
    expect(screen.getByTestId('global-notification')).toBeInTheDocument();
  });

  it('SHOULD render with role alert for screen readers', () => {
    render(<Notification message="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('SHOULD render a custom icon when the icon prop is provided', () => {
    render(<Notification message="Test" icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('SHOULD render the default icon when no icon prop is passed', () => {
    render(<Notification message="Test" type="info" />);
    // No custom icon — the default lucide icon element must still appear inside .icon span
    const alert = screen.getByRole('alert');
    // The icon span contains a child (the SVG stub from lucide-react)
    expect(alert.querySelector('svg, [data-icon]')).not.toBeNull();
  });

  it('SHOULD show the dismiss button when onDismiss is provided', () => {
    render(<Notification message="Test" onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /dismiss notification/i })).toBeInTheDocument();
  });

  it('SHOULD not render the dismiss button when onDismiss is not provided', () => {
    render(<Notification message="Test" />);
    expect(screen.queryByRole('button', { name: /dismiss notification/i })).not.toBeInTheDocument();
  });

  it('SHOULD call onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<Notification message="Test" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  const typeClassCases: NotificationType[] = [
    'success',
    'warning',
    'error',
    'info',
    'neutral',
    'brand',
    'muted',
    'successFilled',
    'warningFilled',
    'errorFilled',
    'brandFilled',
    'reminder',
  ];

  typeClassCases.forEach((type) => {
    it(`SHOULD apply the CSS class "${type}" when type is "${type}"`, () => {
      render(<Notification message="Test" type={type} />);
      const alert = screen.getByRole('alert');
      expect(alert.className).toContain(type);
    });
  });

  it('SHOULD apply the "info" CSS class by default when no type prop is supplied', () => {
    render(<Notification message="Test" />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('info');
  });
});
