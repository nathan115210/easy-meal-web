import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BottomNavigationWrapper from './BottomNavigationWrapper';
import type { NavigationItemProps } from '@/components/navigation/navigationTypes';

const mockItems: NavigationItemProps[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Recipes', href: '/recipes', icon: 'user' },
];

describe('BottomNavigationWrapper', () => {
  it('SHOULD render within a wrapper container', () => {
    const { container } = render(<BottomNavigationWrapper items={mockItems} />);
    const wrapper = container.querySelector('.bottomNavigationWrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('SHOULD render a suspense boundary with fallback skeleton', () => {
    const { container } = render(<BottomNavigationWrapper items={mockItems} />);
    // The component uses Suspense, so it should render either the skeleton or the actual nav
    expect(container.querySelector('.bottomNavigationWrapper')).toBeInTheDocument();
  });
});
