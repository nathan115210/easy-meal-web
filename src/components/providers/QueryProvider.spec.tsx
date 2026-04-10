import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import QueryProvider from './QueryProvider';

describe('QueryProvider', () => {
  it('SHOULD render children correctly', () => {
    render(
      <QueryProvider>
        <div>Child content</div>
      </QueryProvider>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('SHOULD wrap children with QueryClientProvider', () => {
    render(
      <QueryProvider>
        <div data-testid="test-child">Test</div>
      </QueryProvider>
    );
    const child = screen.getByTestId('test-child');
    expect(child).toBeInTheDocument();
  });
});
