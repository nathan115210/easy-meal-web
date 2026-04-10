import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BottomLine from './BottomLine';

describe('BottomLine', () => {
  it('SHOULD render with role status and aria-live polite', () => {
    render(<BottomLine />);
    const element = screen.getByRole('status');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-live', 'polite');
    expect(element).toHaveAttribute('aria-atomic', 'true');
  });

  it('SHOULD display the default label', () => {
    render(<BottomLine />);
    expect(screen.getByText(/reached the end/i)).toBeInTheDocument();
  });

  it('SHOULD display a custom label when provided', () => {
    render(<BottomLine label="No more items" />);
    expect(screen.getByText('No more items')).toBeInTheDocument();
  });

  it('SHOULD not render the clear button when showClear is false', () => {
    render(<BottomLine showClear={false} clearHref="/clear" />);
    expect(screen.queryByText('Clear search')).not.toBeInTheDocument();
  });

  it('SHOULD not render the clear button when clearHref is not provided', () => {
    render(<BottomLine showClear={true} />);
    expect(screen.queryByText('Clear search')).not.toBeInTheDocument();
  });

  it('SHOULD render the clear button when showClear is true and clearHref is provided', () => {
    render(<BottomLine showClear={true} clearHref="/meals" />);
    const clearLink = screen.getByText('Clear search');
    expect(clearLink).toBeInTheDocument();
    expect(clearLink.closest('a')).toHaveAttribute('href', '/meals');
  });
});
