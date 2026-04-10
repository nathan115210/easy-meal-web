import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TopBar from './TopBar';

describe('TopBar', () => {
  it('SHOULD render with testid topbar', () => {
    render(<TopBar />);
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('SHOULD render the logo with correct alt text', () => {
    render(<TopBar />);
    expect(screen.getByAltText('Your brand')).toBeInTheDocument();
  });

  it('SHOULD render the logo as a link to home', () => {
    render(<TopBar />);
    const logo = screen.getByAltText('Your brand').closest('a');
    expect(logo).toHaveAttribute('href', '/');
  });

  it('SHOULD render the search bar when showSearch is true', () => {
    render(<TopBar showSearch={true} />);
    expect(screen.getByTestId('search-bar-input')).toBeInTheDocument();
  });

  it('SHOULD not render the search bar when showSearch is false', () => {
    render(<TopBar showSearch={false} />);
    expect(screen.queryByTestId('search-bar-input')).not.toBeInTheDocument();
  });

  it('SHOULD pass custom inputId to SearchBar', () => {
    render(<TopBar inputId="custom-search" />);
    expect(screen.getByTestId('search-bar-input')).toHaveAttribute('id', 'custom-search');
  });

  it('SHOULD pass custom placeholder to SearchBar', () => {
    render(<TopBar placeholder="Find recipes..." />);
    expect(screen.getByPlaceholderText('Find recipes...')).toBeInTheDocument();
  });

  it('SHOULD render LiveTipsNotificationBar', () => {
    const { container } = render(<TopBar />);
    // LiveTipsNotificationBar renders in the component
    expect(container.querySelector('.topBarContainer')).toBeInTheDocument();
  });
});
