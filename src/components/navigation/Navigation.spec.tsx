import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Navigation from './Navigation';

// Mock the NavigationWrapper since we're testing the data wiring
vi.mock('./NavigationWrapper', () => ({
  default: vi.fn(({ mainNavItems, shortcutItems }) => (
    <div data-testid="navigation-wrapper">
      Data: {mainNavItems?.length || 0} main, {shortcutItems?.length || 0} shortcuts
    </div>
  )),
}));

// Mock the navigation data
vi.mock('@/utils/constants/navigationdata', () => ({
  default: {
    main: [
      { label: 'Discover', href: '/', icon: null },
      { label: 'Recipes', href: '/recipes', icon: null },
    ],
    shortcuts: [{ label: 'Settings', href: '/settings', icon: null }],
  },
}));

describe('Navigation', () => {
  it('SHOULD render NavigationWrapper with main and shortcut navigation data', () => {
    const { getByTestId } = render(<Navigation />);
    const wrapper = getByTestId('navigation-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent('2 main');
    expect(wrapper).toHaveTextContent('1 shortcuts');
  });
});
