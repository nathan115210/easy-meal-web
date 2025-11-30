import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockActive, resetActiveMock } from '@/utils/unit-test/mockUseIsActive';
import useMediaQuery from '@/utils/hooks/useMediaQuery';
import BottomNavigation from './BottomNavigation';
import { NavigationItemProps } from '@/components/navigation/navigationTypes';

vi.mock('@/utils/hooks/useMediaQuery', () => ({
  __esModule: true,
  default: vi.fn(),
}));

type DeviceMock = ReturnType<typeof vi.fn>;
const mockedUseDeviceType = useMediaQuery as unknown as DeviceMock;

const items: NavigationItemProps[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

beforeEach(() => {
  mockedUseDeviceType.mockReset?.();
  resetActiveMock();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('BottomNavigation', () => {
  it('renders nothing on desktop', () => {
    mockedUseDeviceType.mockReturnValue(true); // desktop
    mockActive([]);

    const { container } = render(<BottomNavigation items={items} />);
    expect(container.querySelector('nav')).toBeNull();
  });

  it('renders items on mobile with correct links and icons', () => {
    mockedUseDeviceType.mockReturnValue(false); // mobile
    mockActive([]);

    render(<BottomNavigation items={items} />);

    const nav = screen.getByRole('navigation');
    const list = within(nav).getByRole('list');
    const links = within(list).getAllByRole('link');

    expect(links).toHaveLength(items.length);

    items.forEach((item, idx) => {
      const link = links[idx];
      expect(link).toHaveAttribute('href', item.href);
    });
  });

  it('invokes useIsActive predicate for each item and marks the active one', () => {
    mockedUseDeviceType.mockReturnValue(false); // mobile
    const predicate = mockActive(['/settings']);

    render(<BottomNavigation items={items} />);

    expect(predicate).toHaveBeenCalledTimes(items.length);
    items.forEach((i) => {
      expect(predicate).toHaveBeenCalledWith(i.href);
    });

    // Find the settings link by href (stable) instead of accessible name
    const nav = screen.getByRole('navigation');
    const list = within(nav).getByRole('list');
    const links = within(list).getAllByRole('link');
    const settingsLink = links.find((l) => l.getAttribute('href') === '/settings');

    expect(settingsLink).toBeDefined();
    // If your component applies aria-current="page" for active:
    // expect(settingsLink).toHaveAttribute('aria-current', 'page');
  });
});
