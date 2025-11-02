import type { NavigationItemPros } from '@/components/navigation/navigationTypes';
import { Clock, Home, Settings, Star, User } from 'lucide-react';
import { Fragment } from 'react';
import SideNavigationWrapper from '@/components/navigation/sideNavigation/SideNavigationWrapper';
import BottomNavigationWrapper from '@/components/navigation/bottomNavigation/BottomNavigationWrapper';

const navigationData: NavigationItemPros[] = [
  { label: 'Home', href: '/', icon: <Home /> },
  { label: 'Profile', href: '/profile', icon: <User /> },
  { label: 'Settings', href: '/settdings', icon: <Settings /> },
];

const shortcutData: NavigationItemPros[] = [
  { label: 'Dinner in 30', href: '/dinner', icon: <Clock /> },
  { label: 'Top Rated', href: '/top-rated', icon: <Star /> },
];

export default function Navigation() {
  return (
    <Fragment>
      <SideNavigationWrapper mainNavItems={navigationData} shortcutItems={shortcutData} />
      <BottomNavigationWrapper items={navigationData} />
    </Fragment>
  );
}
