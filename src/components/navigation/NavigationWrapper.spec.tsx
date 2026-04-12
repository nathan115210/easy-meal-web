import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the media query hook - must be declared before importing component
vi.mock('@/utils/hooks/useMediaQuery', () => ({
  default: vi.fn(),
}));

import NavigationWrapper from './NavigationWrapper';
import useMediaQuery from '@/utils/hooks/useMediaQuery';

const mockUseMediaQuery = vi.mocked(useMediaQuery);

// Mock the child navigation components
vi.mock('./sideNavigation/SideNavigationWrapper', () => ({
  default: vi.fn(() => <div data-testid="side-nav">Side Navigation</div>),
}));

vi.mock('./bottomNavigation/BottomNavigationWrapper', () => ({
  default: vi.fn(() => <div data-testid="bottom-nav">Bottom Navigation</div>),
}));

const mockMainNav = [
  { label: 'Home', href: '/', icon: null },
  { label: 'Recipes', href: '/recipes', icon: null },
];

const mockShortcuts = [{ label: 'Settings', href: '/settings', icon: null }];

describe('NavigationWrapper', () => {
  it('SHOULD render side navigation on desktop', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const { getByTestId } = render(
      <NavigationWrapper mainNavItems={mockMainNav} shortcutItems={mockShortcuts} />
    );
    expect(getByTestId('side-nav')).toBeInTheDocument();
  });

  it('SHOULD render bottom navigation on mobile', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const { getByTestId } = render(
      <NavigationWrapper mainNavItems={mockMainNav} shortcutItems={mockShortcuts} />
    );
    expect(getByTestId('bottom-nav')).toBeInTheDocument();
  });

  it('SHOULD render placeholder when viewport is unknown', () => {
    mockUseMediaQuery.mockReturnValue(null);
    const { container } = render(
      <NavigationWrapper
        mainNavItems={mockMainNav}
        placeholder={<div data-testid="placeholder">Loading...</div>}
      />
    );
    expect(container.querySelector('[data-testid="placeholder"]')).toBeInTheDocument();
  });

  it('SHOULD render nothing when viewport is unknown and no placeholder', () => {
    mockUseMediaQuery.mockReturnValue(null);
    const { container } = render(<NavigationWrapper mainNavItems={mockMainNav} />);
    // Should render an empty fragment, so the container's firstChild should be empty
    expect(container.firstChild).toBeNull();
  });
});
