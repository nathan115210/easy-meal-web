// File: 'src/components/navigation/sideNavigation/sideNavigation.spec.tsx'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { mockActive, resetActiveMock } from '@/utils/test/unit-test/mockUseIsActive';
import useMediaQuery from '@/utils/hooks/useMediaQuery';
import SideNavigation from './SideNavigation';
import { NavigationItemProps } from '@/components/navigation/navigationTypes';

// Deterministic CSS classes for assertions
vi.mock('./sideNavigation.module.scss', () => ({
  default: {
    sideNavigation: 'sideNavigation',
    logo: 'logo',
    navigationList: 'navigationList',
    navigationListItem: 'navigationListItem',
    active: 'active',
    shortcutSection: 'shortcutSection',
  },
}));

// Mock only the device-type hook
vi.mock('@/utils/hooks/useMediaQuery', () => ({
  __esModule: true,
  default: vi.fn(),
}));

type DeviceMock = ReturnType<typeof vi.fn>;
const mockedUseDeviceType = useMediaQuery as unknown as DeviceMock;

const mainNavItems: NavigationItemProps[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Profile', href: '/profile', icon: 'user' },
];

const shortcutItems: NavigationItemProps[] = [
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

beforeEach(() => {
  mockedUseDeviceType.mockReset?.();
  resetActiveMock();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('SideNavigation', () => {
  it('renders nothing on non-desktop (mobile/tablet)', () => {
    mockedUseDeviceType.mockReturnValue(false); // not desktop
    mockActive([]);

    const { container } = render(
      <SideNavigation mainNavItems={mainNavItems} shortcutItems={shortcutItems} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders main and shortcut lists with icons on desktop', () => {
    mockedUseDeviceType.mockReturnValue(true); // desktop
    mockActive([]);

    const { container } = render(
      <SideNavigation mainNavItems={mainNavItems} shortcutItems={shortcutItems} />
    );

    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('sideNavigation');

    // Logo link is named by the img alt text (mocked next/image)
    const logoLink = within(aside).getByRole('link', { name: /your brand/i });
    expect(logoLink).toHaveClass('logo');
    expect(logoLink).toHaveAttribute('href', '/');

    // Lists exist with deterministic classes
    const lists = within(aside).getAllByRole('list');
    expect(lists.length).toBeGreaterThanOrEqual(2);
    lists.forEach((ul) => expect(ul).toHaveClass('navigationList'));

    // Links and labels inside nav lists (exclude logo)
    const navLinks = lists.flatMap((ul) => within(ul).getAllByRole('link'));
    const hrefs = navLinks.map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/', '/profile', '/settings']));

    // Item classes for nav links only
    navLinks.forEach((a) => expect(a).toHaveClass('navigationListItem'));

    // Icons rendered via global mock: <i data-icon="...">
    expect(container.querySelector('i[data-icon="home"]')).toBeTruthy();
    expect(container.querySelector('i[data-icon="user"]')).toBeTruthy();
    expect(container.querySelector('i[data-icon="settings"]')).toBeTruthy();

    // Shortcuts section header
    expect(screen.getByText('Shortcuts')).toBeInTheDocument();
  });

  it('applies active class only to active items', () => {
    mockedUseDeviceType.mockReturnValue(true); // desktop
    const predicate = mockActive(['/settings']); // only settings active

    render(<SideNavigation mainNavItems={mainNavItems} shortcutItems={shortcutItems} />);

    // Predicate called for each item
    expect(predicate).toHaveBeenCalledTimes(mainNavItems.length + shortcutItems.length);
    [...mainNavItems, ...shortcutItems].forEach((i) => {
      expect(predicate).toHaveBeenCalledWith(i.href);
    });

    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toHaveClass('active');

    const nonActive = screen.getAllByRole('link').filter((a) => a !== settingsLink);
    nonActive.forEach((a) => expect(a).not.toHaveClass('active'));
  });

  it('calls the isActive predicate for each main and shortcut item', () => {
    mockedUseDeviceType.mockReturnValue(true); // desktop
    const predicate = mockActive([]); // none active; we just care about calls

    render(<SideNavigation mainNavItems={mainNavItems} shortcutItems={shortcutItems} />);

    // Called once per item
    expect(predicate).toHaveBeenCalledTimes(mainNavItems.length + shortcutItems.length);

    // Called with each item's href
    [...mainNavItems, ...shortcutItems].forEach((item) => {
      expect(predicate).toHaveBeenCalledWith(item.href);
    });
  });
});
