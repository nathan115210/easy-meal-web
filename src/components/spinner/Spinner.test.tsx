import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('SHOULD render with role status for screen readers', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('SHOULD render with aria-live polite', () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('SHOULD display the loading label when provided', () => {
    render(<Spinner loadingLabel="Loading recipes..." />);
    expect(screen.getByText('Loading recipes...')).toBeInTheDocument();
  });

  it('SHOULD not display a label when loadingLabel is not provided', () => {
    const { container } = render(<Spinner />);
    const labelElement = container.querySelector('.loadingLabel');
    expect(labelElement).not.toBeInTheDocument();
  });

  it('SHOULD render the spinner element with aria-hidden', () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.querySelector('[aria-hidden]');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('SHOULD spread additional props to the root element', () => {
    render(<Spinner data-testid="custom-spinner" />);
    expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
  });
});
