import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('SHOULD render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('SHOULD have type button by default', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('SHOULD accept a custom type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('SHOULD apply the default primary variant class', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('.button--primary');
    expect(button).toBeInTheDocument();
  });

  it('SHOULD apply the secondary variant class', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    const button = container.querySelector('.button--secondary');
    expect(button).toBeInTheDocument();
  });

  it('SHOULD apply the ghost variant class', () => {
    const { container } = render(<Button variant="ghost">Test</Button>);
    const button = container.querySelector('.button--ghost');
    expect(button).toBeInTheDocument();
  });

  it('SHOULD apply the default md size class', () => {
    const {} = render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    // md is default so no extra size class is applied
    expect(button).not.toHaveClass('button--sm');
    expect(button).not.toHaveClass('button--lg');
  });

  it('SHOULD apply the sm size class', () => {
    const {} = render(<Button size="sm">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--sm');
  });

  it('SHOULD apply the lg size class', () => {
    const { container } = render(<Button size="lg">Test</Button>);
    const button = container.querySelector('.button--lg');
    expect(button).toBeInTheDocument();
  });

  it('SHOULD apply icon-only class when iconOnly is true', () => {
    const { container } = render(
      <Button iconOnly aria-label="Close">
        X
      </Button>
    );
    const button = container.querySelector('.button--icon-only');
    expect(button).toBeInTheDocument();
  });

  it('SHOULD call onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Click me
      </Button>
    );
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('SHOULD not call onClick when loading', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} loading>
        Click me
      </Button>
    );
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('SHOULD set disabled attribute when disabled is true', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('SHOULD set aria-disabled when disabled is true', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('SHOULD set aria-busy when loading is true', () => {
    render(<Button loading>Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('SHOULD display loading spinner when loading is true', () => {
    const { container } = render(<Button loading>Test</Button>);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('SHOULD display loading text with role status when loading', () => {
    render(
      <Button loading loadingText="Processing...">
        Test
      </Button>
    );
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Processing...');
  });

  it('SHOULD hide children label visually when loading and iconOnly', () => {
    const { container } = render(
      <Button loading iconOnly aria-label="Close">
        X
      </Button>
    );
    // buttonLabel span should not be rendered when loading + iconOnly
    const label = container.querySelector('.buttonLabel');
    expect(label).not.toBeInTheDocument();
  });

  it('SHOULD set aria-pressed when pressed prop is provided', () => {
    render(<Button pressed={true}>Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('SHOULD not set aria-pressed when pressed prop is undefined', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
  });

  it('SHOULD apply custom className when provided', () => {
    render(<Button className="custom-btn">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-btn');
  });

  it('SHOULD forward refs to the button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Test</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('SHOULD warn in development when iconOnly is true but aria-label is missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Button iconOnly>X</Button>);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Button: `iconOnly` requires an accessible label via `aria-label`.'
    );
    consoleSpy.mockRestore();
  });
});
