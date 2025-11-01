import type { NavigationItemPros } from '@/components/navigation/navigationTypes';
import { Clock, Home, Settings, Star, User } from 'lucide-react';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import SideNavigation from '@/components/navigation/SideNavigation';
import { Fragment } from 'react';

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
      <SideNavigation mainNavItems={navigationData} shortcutItems={shortcutData} />
      <BottomNavigation items={navigationData} />
    </Fragment>
  );
}
