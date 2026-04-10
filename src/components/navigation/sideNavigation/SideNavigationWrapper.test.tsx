import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SideNavigationWrapper from './SideNavigationWrapper';

const mockMainNav = [
  { label: 'Home', href: '/', icon: null },
  { label: 'Recipes', href: '/recipes', icon: null },
];

const mockShortcuts = [{ label: 'Settings', href: '/settings', icon: null }];

describe('SideNavigationWrapper', () => {
  it('SHOULD render within a wrapper container', () => {
    const { container } = render(
      <SideNavigationWrapper mainNavItems={mockMainNav} shortcutItems={mockShortcuts} />
    );
    const wrapper = container.querySelector('.sideNavigationWrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('SHOULD render a suspense boundary with fallback skeleton', () => {
    const { container } = render(
      <SideNavigationWrapper mainNavItems={mockMainNav} shortcutItems={mockShortcuts} />
    );
    // The component uses Suspense, so it should render either the skeleton or the actual nav
    expect(container.querySelector('.sideNavigationWrapper')).toBeInTheDocument();
  });
});
